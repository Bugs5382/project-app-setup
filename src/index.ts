#!/usr/bin/env node

// start of imports
import * as fs from 'fs'
import _ from 'lodash'
import { input, select, confirm } from '@inquirer/prompts'
import path from 'node:path'
import { getProjectName } from './helpers/getProjectName.js'
import { installDeps } from './helpers/installDeps.js'
import { parseOptions } from './helpers/parseOptions.js'
import { DEFAULT_NPM, isProd } from './modules/constants.js'
import { returnDependencies } from './modules/dependencies.js'
import * as git from './modules/git.js'
import { generateLicense, licenseChoices } from './modules/license.js'
import { generatePackageJson } from './modules/npm.js'
import { generateTemplate } from './modules/template.js'

/**
 * Main Executable Function
 * @remarks Runs by default.
 * @since 1.0.0
 */
export const main = async (): Promise<void> => {
  // get options
  const options = await parseOptions()

  // default project name
  const defaultProjectName = isProd() ? path.basename(process.cwd()) : 'project-app-setup'

  // set var
  const npmName = !isProd() ? undefined : await getProjectName(_.kebabCase(defaultProjectName))

  const answers = {
    firstSet: {
      npm: '',
      gitLocation: '',
      website: '',
      type: ''
    },
    secondSet: {
      typeApp: ''
    },
    thirdSet: {
      description: '',
      keywords: '',
      email: '',
      license: ''
    }
  }

  answers.firstSet = {
    npm: await input({
      default: defaultProjectName,
      message: 'Your Project NPM name?'
    }),
    gitLocation: await select({
      choices: [
        { name: 'Github', value: 'github' },
        { name: 'Private Repo', value: 'private-repo' },
        { name: 'Skip Git', value: 'skip-git' }
      ],
      default: 'github',
      message: 'Where are we storing this code today?'
    }),
    website: await input({
      message: 'Homepage of Author:'
    }),
    type: await select({
      choices: [
        { name: 'NodeJS', value: 'nodejs' },
        { name: 'Vite/React', value: 'vite-react' }
      ],
      default: 'nodejs',
      message: 'What type of app are we creating today?'
    })
  }

  if (answers.firstSet.type === 'node') {
    answers.secondSet.typeApp = await select({
      choices: [
        { name: 'Empty Project', value: 'empty-project' },
        { name: 'Fastify GraphQL Controller', value: 'fastify-graphql-controller' },
        { name: 'Fastify GraphQL Microservice', value: 'fastify-graphql-microservice' },
        { name: 'Fastify Standalone NPM Package', value: 'fastify-npm-package' },
        { name: 'Standalone NPM Package', value: 'npm-package' }
      ],
      default: 'empty-project',
      message: 'What type of NodeJS app are we creating today?'
    })
  } else {
    answers.secondSet.typeApp = await select({
      choices: [
        { name: 'Vite with React + SWC', value: 'vite-react-swc' }
      ],
      default: 'vite-react-swc',
      message: 'What type of Vite/React app are we creating today?'
    })
  }

  let port
  if (answers.secondSet.typeApp === 'fastify-graphql-controller' || answers.secondSet.typeApp === 'fastify-graphql-microservice') {
    port = await input({
      default: '3000',
      message: 'Provide the port app should run under during development:'
    })
  }

  answers.thirdSet = {
    description: await input({
      message: 'Provide a description:'
    }),
    keywords: await input({
      message: 'Package keywords (comma to split):'
    }),
    email: await input({
      message: 'Provide a email address:'
    }),
    license: await select({
      choices: licenseChoices,
      message: 'What type of license does this app follow?'
    })
  }

  const temp: string = !isProd() ? 'temp/' : ''

  // Create folder
  const folder: string = options.sameFolder === true ? '' : typeof npmName !== 'undefined' ? npmName : answers.firstSet.npm
  const cwd = path.join(process.cwd(), `${temp}/${folder}`)
  fs.mkdirSync(cwd, { recursive: true })
  process.chdir(cwd)

  if (fs.existsSync('package.json')) {
    const continueAnyway = await confirm({
      message: 'package.json exists already. Continue?',
      default: false
    })

    if (!continueAnyway) {
      process.exit()
    }
  }

  // GIT: Initial
  let gitIssues: string | undefined
  let gitReadme: string | undefined
  let gitUrl: string | undefined
  let gitOwner: string | undefined
  if (answers.firstSet.gitLocation !== 'skip-git') {
    await git.init(cwd, 'initial')
    switch (answers.firstSet.gitLocation) {
      case 'github': {
        const repoOwner = await input({
          message: 'Repository Owner (e.g. https://github.com/[OWNER]):',
          default: 'Bugs5382' // this is me!
        })

        const repoName = await input({
          message: 'Repository Project Name (e.g. https://github.com/OWNER/[PROJECT NAME]):',
          validate: (result) => {
            if (result === '') {
              return 'Error: Please enter a repo name. If the repo does not exist, it will be created for you.'
            } else {
              return true
            }
          }
        })

        await git.addRemoteGitHub(cwd, repoOwner, repoName.toLowerCase())

        gitUrl = `https://github.com/${repoOwner}/${repoName}.git`
        gitOwner = repoOwner
        break
      }

      case 'private-repo': {
        const repoUrl = await input({
          message: 'Full URL of Git Repo (e.g. https://REPOURL) Do not include the trailing /:'
        })

        const repoProject = await input({
          message: 'Project "Folder (e.g. https://REPOURL/[PROJECT]) Do not include the trailing /:'
        })

        const repoNamePrivate = await input({
          message: 'Repository Repo Name (e.g. https://REPOURL/PROJECT/[REPONAME].git}):',
          validate: (result) => {
            if (result === '') {
              return 'Error: Please enter a repo name. If the repo does not exist, it will be potentially created for you.'
            } else {
              return true
            }
          }
        })

        await git.addRemotePrivate(cwd, repoUrl, repoProject, repoNamePrivate)

        gitUrl = `${repoUrl}/${repoProject}/${repoNamePrivate}.git`
        gitOwner = repoProject
        break
      }
    }
    gitIssues = `${gitUrl as string}/issues`
    gitReadme = `${gitUrl as string}#readme`
  }

  const license = answers.thirdSet.license
  const email = answers.thirdSet.email
  const website = answers.firstSet.website
  const npm = answers.firstSet.npm
  const description = answers.thirdSet.description
  const keywords = answers.thirdSet.keywords.split(',')
  const gitLocation = answers.firstSet.gitLocation
  const type = answers.firstSet.type
  const node = answers.secondSet.typeApp
  const vite = answers.secondSet.typeApp

  // Generate Licence
  await generateLicense({
    license,
    name: DEFAULT_NPM.author.name,
    email,
    website
  })

  // Generate package.json
  const packageJson = generatePackageJson({
    ...DEFAULT_NPM,
    name: typeof npmName !== 'undefined' ? npmName : npm,
    description,
    gitIssues,
    gitReadme,
    gitUrl,
    license,
    keywords
  }, {
    type,
    node,
    vite,
    git: gitLocation === 'skip-git',
    github: gitLocation === 'github',
    options: { port }
  })
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 4))

  // Move Templates
  await generateTemplate({
    type,
    node,
    vite,
    git: gitLocation === 'skip-git',
    github: gitLocation === 'github'
  }, {
    npm: typeof npmName !== 'undefined' ? npmName : npm,
    author: DEFAULT_NPM.author.name,
    repoOwner: gitOwner,
    description,
    homepage: website,
    license
  })

  // Get Dependencies
  const packages = returnDependencies({
    type,
    node,
    vite,
    git: gitLocation === 'skip-git',
    github: gitLocation === 'github'
  })

  // GIT: Post Step
  await git.init(cwd, 'post')

  // Install Dependencies
  await installDeps(packages.dependencies)
  await installDeps(packages.devDependencies, { dev: true })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
