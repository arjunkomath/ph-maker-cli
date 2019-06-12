import Command from '@oclif/command'
import ora from 'ora'
import terminalLink from 'terminal-link'
import APIClient from '../APIClient'
import { ListProjectsQuery } from '../queries'
import { MakerProject } from '../APIClient/client.data';
export class Project extends Command {
  static description = 'manage projects'

  static args = [
    {
      name: 'action',
      required: true,
      description: 'Enter Action',
      default: 'list',
      options: ['list'],
    }
  ]

  async listProjects() {
    const client = await APIClient()

    const spinner = ora('Fetching Projects').start()
    let projects

    try {
      projects = await client.request(ListProjectsQuery)
      spinner.stop()
    } catch (error) {
      spinner.stop()
      this.error('Fetching Projects Failed!', { exit: 1 })
    }

    projects.viewer.makerProjects.edges.forEach((project: MakerProject) => {
      const link = terminalLink('Open Project', project.node.url);
      this.log(`
      => ${project.node.name} (${project.node.tagline})
      ${link}
      `)
    });

    this.exit(0)
  }

  async run() {
    const { args } = this.parse(Project)

    switch (args.action) {
      case 'list': return this.listProjects()
    }
  }
}
