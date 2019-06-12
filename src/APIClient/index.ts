import { GraphQLClient } from 'graphql-request'
import ora from 'ora'
import { PH_API_URL } from '../config'
import db from '../database'

import { Login } from '../commands/login'
import { ListGoalsQuery, ListProjectsQuery } from '../queries';
import { FetchGoalResponse, FetchProjectResponse } from './client.data';

const client = async (): Promise<GraphQLClient> => {
  const access_token = db.get('user.access_token').value()

  if (!access_token) {
    return Login.run(['']);
  }

  return new GraphQLClient(PH_API_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
}

export const fetchGoals = async (context: any): Promise<any> => {
  const _client = await client()

  const spinner = ora('Fetching Goals').start()
  let goals
  try {
    goals = await _client.request(ListGoalsQuery)
    spinner.stop()
  } catch (error) {
    spinner.stop()
    context.error('Fetching Goals Failed! Report Issue -> https://github.com/arjunkomath/ph-maker-cli/issues', { exit: 1 })
  }

  return goals
}

export const fetchProjects = async (context: any): Promise<any> => {
  const _client = await client()

  const spinner = ora('Fetching Projects').start()
  let projects
  try {
    projects = await _client.request(ListProjectsQuery)
    spinner.stop()
  } catch (error) {
    spinner.stop()
    context.error('Fetching Projects Failed! Report Issue -> https://github.com/arjunkomath/ph-maker-cli/issues', { exit: 1 })
  }

  return projects
}

export default client

