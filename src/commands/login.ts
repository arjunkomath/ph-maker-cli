import Command from '@oclif/command'
import ora from 'ora'
import db from '../database'
import { GraphQLClient } from 'graphql-request'
import { PH_API_URL } from '../config'
import { ValidateUserQuery } from '../queries'
import { User } from '../APIClient/client.data';

const inquirer = require('inquirer')

interface ILoginData {
  access_token: string
}

export class Login extends Command {
  static description = 'login to product hunt'

  async run() {
    this.log(`
    Login to Product Hunt and get your access token here:
    https://ph-maker-oauth.arjunkomath.now.sh/
    `)

    const answer: ILoginData = await inquirer
      .prompt([{
        type: 'input',
        name: 'access_token',
        message: "Enter your access token"
      }])

    if (!answer.access_token) {
      this.error('Please enter a valid access token', { exit: 2 })
    }

    const spinner = ora('Validating your token...').start();

    const client = new GraphQLClient(PH_API_URL, {
      headers: {
        Authorization: `Bearer ${answer.access_token}`
      }
    })

    try {
      const user: User = await client.request(ValidateUserQuery)

      db.set('user.access_token', answer.access_token)
        .write()

      spinner.succeed(`Welcome ${user.viewer.user.name}!`)
    } catch (e) {
      spinner.fail(`Token validation failed!`)
      return this.exit(1)
    }

    this.exit(0)
  }
}
