import Command from '@oclif/command'
import db from '../database'

export class Logout extends Command {
  static description = 'logout'

  async run() {
    db.unset('user.access_token')
      .write()

    this.log('Logout success!')
    this.exit(0)
  }
}
