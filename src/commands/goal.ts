import Command from '@oclif/command'
import ora from 'ora'
import APIClient from '../APIClient'
import { ListGoalsQuery, ListProjectsQuery } from '../queries'
import { MakerProject } from './project';
import { CreateGoal, GoalMarkAsComplete, GoalMarkAsIncomplete } from '../mutations';

const figures = require('figures')
const chalk = require('chalk')
const inquirer = require('inquirer')
const moment = require('moment')
const signale = require('signale')
signale.config({ displayLabel: false });

const { pending, success } = signale;

export interface MakerGoal {
  node: {
    id: string;
    createdAt: string;
    title: string;
    completedAt: string;
    dueAt: string;
    cheerCount: number
    project: {
      id: string;
      name: string;
    };
  }
}

export class Goal extends Command {
  static description = 'manage goal'

  static args = [
    {
      name: 'action',
      description: 'Enter Action',
      options: ['list', 'create', 'complete', 'incomplete'],
    }
  ]

  async listGoals() {
    const client = await APIClient()

    const spinner = ora('Fetching Goals').start()
    let goals
    try {
      goals = await client.request(ListGoalsQuery)
      spinner.stop()
    } catch (error) {
      spinner.stop()
      this.error('Fetching Goals Failed!', { exit: 1 })
    }

    this.log(chalk.yellow.bold(`
    What are you working on today?`))

    const todo = goals.viewer.goals.edges
      .filter((goal: MakerGoal) => !goal.node.completedAt)
    const completed = goals.viewer.goals.edges
      .filter((goal: MakerGoal) => goal.node.completedAt)

    if (todo.length) {
      this.log(chalk.bold(`
    ${figures.bullet} Pending (${todo.length}/${goals.viewer.goals.edges.length})
      `))
      todo.forEach((goal: MakerGoal) => {
        pending({
          prefix: '\t',
          message: goal.node.title,
        });
        this.log(
          chalk.red(`\t     ${figures.heart} ${goal.node.cheerCount}`) +
          chalk.gray(`${goal.node.dueAt ? (' | Due - ' + moment(goal.node.dueAt).fromNow()) : ''} ${goal.node.project ? ('| Project - ' + goal.node.project.name) : ''}`))
      });
    }

    this.log(chalk.bold(`
    ${figures.bullet} Completed (${completed.length}/${goals.viewer.goals.edges.length})
      `))
    completed.forEach((goal: MakerGoal) => {
      success({
        prefix: '\t',
        message: chalk.strikethrough(goal.node.title),
      });
      this.log(
        chalk.red(`\t     ${figures.heart} ${goal.node.cheerCount}`) +
        chalk.gray(` | Completed - ${moment(goal.node.completedAt).fromNow()} ${goal.node.project ? ('| Project - ' + goal.node.project.name) : ''}`))
    });

    this.log('\n')
  }

  async createGoal() {
    const client = await APIClient()

    let projects
    let spinner = ora('Fetching Projects').start()
    try {
      projects = await client.request(ListProjectsQuery)
      spinner.stop()
    } catch (error) {
      spinner.stop()
      this.error('Fetching Projects Failed!', { exit: 1 })
    }

    const goal = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: "What's your goal",
          validate: (value: string) => !!value.trim()
        },
        {
          type: 'list',
          name: 'projectId',
          message: 'Assign to project',
          choices: [
            ...projects.viewer.makerProjects.edges.map((project: MakerProject) => ({ value: project.node.id, name: project.node.name })),
            new inquirer.Separator(),
            { value: false, name: 'No, just create the goal!' }
          ],
        }
      ])

    if (!goal.projectId) {
      delete goal.projectId
    }

    spinner = ora('Creating goal').start()
    try {
      await client.request(CreateGoal, { input: goal })
      spinner.succeed('Goal Created')
    } catch (error) {
      spinner.stop()
      this.error('Creating goal Failed!', { exit: 1 })
    }
  }

  async markGoalComplete() {
    const client = await APIClient()

    let spinner = ora('Fetching Goals').start()
    const goals = await client.request(ListGoalsQuery)
    spinner.stop()

    const { goalIds } = await inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'goalIds',
          message: "Select Goals",
          validate: (answer: [any]) => answer.length >= 1,
          choices: [
            ...goals.viewer.goals.edges
              .filter((goal: MakerGoal) => !goal.node.completedAt)
              .map((goal: MakerGoal) => ({ value: goal.node.id, name: goal.node.title })),
          ]
        }
      ])

    spinner = ora('Updating goals').start()
    try {
      for (let i = 0; i < goalIds.length; i++) {
        await client.request(GoalMarkAsComplete, { input: { goalId: goalIds[i] } })
      }
      spinner.succeed('Goals updated')
    } catch (error) {
      spinner.stop()
      this.error('Updating goals Failed!', { exit: 1 })
    }
  }

  async markGoalIncomplete() {
    const client = await APIClient()

    let spinner = ora('Fetching Goals').start()
    const goals = await client.request(ListGoalsQuery)
    spinner.stop()

    const { goalIds } = await inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'goalIds',
          message: "Select Goals",
          validate: (answer: [any]) => answer.length >= 1,
          choices: [
            ...goals.viewer.goals.edges
              .filter((goal: MakerGoal) => goal.node.completedAt)
              .map((goal: MakerGoal) => ({ value: goal.node.id, name: goal.node.title })),
          ]
        }
      ])

    spinner = ora('Updating goals').start()
    try {
      for (let i = 0; i < goalIds.length; i++) {
        await client.request(GoalMarkAsIncomplete, { input: { goalId: goalIds[i] } })
      }
      spinner.succeed('Goals updated')
    } catch (error) {
      spinner.stop()
      this.error('Updating goals Failed!', { exit: 1 })
    }
  }

  async promptActions() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            { value: 'list', name: 'List goals' },
            { value: 'create', name: 'Create goal' },
            { value: 'complete', name: 'Mark goal as complete' },
            { value: 'incomplete', name: 'Mark goal as incomplete' },
            new inquirer.Separator(),
            'Cancel'
          ]
        }
      ])
  }

  async run() {
    const { args } = this.parse(Goal)

    if (!args.action) {
      const { action } = await this.promptActions()
      await Goal.run([action])
    }

    switch (args.action) {
      case 'list': await this.listGoals()
        break
      case 'create': await this.createGoal()
        break
      case 'complete': await this.markGoalComplete()
        break
      case 'incomplete': await this.markGoalIncomplete()
        break
    }

    this.exit(0)
  }

}
