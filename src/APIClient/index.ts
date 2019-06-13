import { GraphQLClient } from 'graphql-request'
import ora from 'ora'
import { PH_API_URL } from '../config'
import db from '../database'

import { Login } from '../commands/login'
import { ListGoalsQuery, ListProjectsQuery } from '../queries';
import { FetchGoalResponse, FetchProjectResponse, MakerGoal, MakerProject } from './client.data';

// Check for updates
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
updateNotifier({ pkg }).notify();

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

export const fetchGoals = async (context: any): Promise<MakerGoal[]> => {
  const _client = await client()

  const spinner = ora('Fetching Goals').start()
  try {
    const goals: FetchGoalResponse = await _client.request(ListGoalsQuery)
    spinner.stop()
    return goals.viewer.goals.edges
  } catch (error) {
    spinner.stop()
    context.error('Fetching Goals Failed! Report Issue -> https://github.com/arjunkomath/ph-maker-cli/issues', { exit: 1 })
  }

  return []
}

export const fetchProjects = async (context: any): Promise<MakerProject[]> => {
  const _client = await client()

  const spinner = ora('Fetching Projects').start()
  try {
    const projects: FetchProjectResponse = await _client.request(ListProjectsQuery)
    spinner.stop()
    return projects.viewer.makerProjects.edges
  } catch (error) {
    spinner.stop()
    context.error('Fetching Projects Failed! Report Issue -> https://github.com/arjunkomath/ph-maker-cli/issues', { exit: 1 })
  }

  return []
}

export default client

