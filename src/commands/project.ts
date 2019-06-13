import Command from '@oclif/command'
import terminalLink from 'terminal-link'
import { fetchProjects } from '../APIClient'
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
    const projects: MakerProject[] = await fetchProjects(this)

    projects.forEach((project: MakerProject) => {
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
