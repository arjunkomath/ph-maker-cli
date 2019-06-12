import { GraphQLClient } from 'graphql-request'
import { PH_API_URL } from '../config'
import db from '../database'

import { Login } from '../commands/login'

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

export default client

