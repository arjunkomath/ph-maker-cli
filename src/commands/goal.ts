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
  static description = 'Manage Goal'

  static args = [
    {
      name: 'action',
      required: true,
      description: 'Enter Action',
      default: 'list',
      options: ['list', 'create', 'complete', 'incomplete'],
    }
  ]

  async listGoals() {
    const client = await APIClient()

    const spinner = ora('Fetching Goals').start()
    const goals = await client.request(ListGoalsQuery)
    spinner.stop()

    this.log(chalk.yellow.bold(`
    What are you working on today?`))

    const todo = goals.viewer.goals.edges
      .filter((goal: MakerGoal) => !goal.node.completedAt)
    const completed = goals.viewer.goals.edges
      .filter((goal: MakerGoal) => goal.node.completedAt)

    if (todo.length) {
      this.log(chalk.bold(`
    Pending (${todo.length}/${goals.viewer.goals.edges.length})
      `))
      todo.forEach((goal: MakerGoal) => {
        pending({
          prefix: chalk.red(`${figures.heart} ${goal.node.cheerCount}`),
          message: goal.node.title,
          suffix: goal.node.project && `(${goal.node.project.name})`
        });
      });
    }

    this.log(chalk.bold(`
    Completed (${completed.length}/${goals.viewer.goals.edges.length})
      `))
    completed.forEach((goal: MakerGoal) => {
      success({
        prefix: chalk.red(`${figures.heart} ${goal.node.cheerCount}`),
        message: chalk.gray.strikethrough(goal.node.title),
        suffix: goal.node.project && `(${goal.node.project.name})`
      });
    });

    this.log('\n')

    const { action } = await this.promptActions()

    switch (action) {
      case 'create':
        await Goal.run(['create'])
        break
      case 'mark_done':
        await Goal.run(['complete'])
        break
      case 'mark_not_done':
        await Goal.run(['incomplete'])
        break
    }
  }

  async createGoal() {
    const client = await APIClient()

    let spinner = ora('Fetching Projects').start()
    const projects = await client.request(ListProjectsQuery)
    spinner.stop()

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
    await client.request(CreateGoal, { input: goal })
    spinner.succeed('Goal Created')
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
    for (let i = 0; i < goalIds.length; i++) {
      await client.request(GoalMarkAsComplete, { input: { goalId: goalIds[i] } })
    }
    spinner.succeed('Goals updated')
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
    for (let i = 0; i < goalIds.length; i++) {
      await client.request(GoalMarkAsIncomplete, { input: { goalId: Number(goalIds[i]) } })
    }
    spinner.succeed('Goals updated')
  }

  async promptActions() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What do you want to do?',
          choices: [
            { value: 'create', name: 'Create goal' },
            { value: 'mark_done', name: 'Mark goal as complete' },
            { value: 'mark_not_done', name: 'Mark goal as incomplete' },
            new inquirer.Separator(),
            'Done'
          ]
        }
      ])
  }

  async run() {
    const { args } = this.parse(Goal)

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
