import Command from '@oclif/command'
import ora from 'ora'
import APIClient, { fetchGoals, fetchProjects } from '../APIClient'
import { CreateGoal, GoalMarkAsComplete, GoalMarkAsIncomplete, UpdateGoal } from '../mutations';
import { FetchGoalResponse, MakerGoal, MakerProject, FetchProjectResponse } from '../APIClient/client.data';

const figures = require('figures')
const chalk = require('chalk')
const inquirer = require('inquirer')
const moment = require('moment')
const signale = require('signale')
signale.config({ displayLabel: false });

const { pending, success } = signale;

export class Goal extends Command {
  static description = 'manage goal'

  static args = [
    {
      name: 'action',
      description: 'Enter Action',
      options: ['list', 'create', 'edit', 'complete', 'incomplete'],
    }
  ]

  async listGoals() {
    const goals: FetchGoalResponse = await fetchGoals(this)

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
    const projects: FetchProjectResponse = await fetchProjects(this)

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
          message: 'Assign to project?',
          choices: [
            ...projects.viewer.makerProjects.edges.map((project: MakerProject) => ({ value: project.node.id, name: project.node.name })),
            new inquirer.Separator(),
            { value: false, name: 'No' }
          ],
        }
      ])

    if (!goal.projectId) {
      delete goal.projectId
    }

    const spinner = ora('Creating goal').start()
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

    const goals: FetchGoalResponse = await fetchGoals(this)
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

    const spinner = ora('Updating goals').start()
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

    const goals: FetchGoalResponse = await fetchGoals(this)
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

    const spinner = ora('Updating goals').start()
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

  async editGoal() {
    const client = await APIClient()

    const goals = await fetchGoals(this)
    const projects = await fetchProjects(this)

    const { goalIds } = await inquirer
      .prompt([
        {
          type: 'checkbox',
          name: 'goalIds',
          message: "Select Goal to edit",
          validate: (answer: [any]) => answer.length === 1,
          choices: [
            ...goals.viewer.goals.edges
              .map((goal: MakerGoal) => ({ value: goal.node.id, name: goal.node.title })),
          ]
        }
      ])

    const goal = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: "What's your new goal",
          validate: (value: string) => !!value.trim()
        },
        {
          type: 'list',
          name: 'projectId',
          message: 'Assign to project?',
          choices: [
            ...projects.viewer.makerProjects.edges.map((project: MakerProject) => ({ value: project.node.id, name: project.node.name })),
            new inquirer.Separator(),
            { value: false, name: 'No' }
          ],
        }
      ])

    if (!goal.projectId) {
      delete goal.projectId
    }

    const spinner = ora('Updating goal').start()
    try {
      await client.request(UpdateGoal, {
        input: {
          goalId: goalIds[0],
          ...goal
        }
      })
      spinner.succeed('Goal updated')
    } catch (error) {
      spinner.stop()
      this.error('Updating goal Failed!', { exit: 1 })
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
            { value: 'edit', name: 'Edit goal' },
            new inquirer.Separator(),
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
      case 'edit': await this.editGoal()
        break
      case 'complete': await this.markGoalComplete()
        break
      case 'incomplete': await this.markGoalIncomplete()
        break
    }

    this.exit(0)
  }

}
