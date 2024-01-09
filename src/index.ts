#!/usr/bin/env node

// start of imports
import * as fs from 'fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import path from 'node:path'
import { DEFAULT_NPM, isProd } from './modules/constants.js'
import { returnDependencies } from './modules/dependencies.js'
import * as git from './modules/git.js'
import { getProjectName, installDeps, parseOptions } from './modules/helpers.js'
import { generateLicense, licenseChoices } from './modules/license.js'
import { generatePackageJson } from './modules/npm.js'
import { generateTemplate } from './modules/template.js'

/**
 * Main Executable Function
 * @description Runs by default.
 * @since 1.0.0
 */
export const main = async (): Promise<void> => {
  // get options
  const options = await parseOptions()

  // default project name
  const defaultProjectName = isProd() ? path.basename(process.cwd()) : 'project-app-setup'

  // set var
  const npmName = !isProd() ? undefined : await getProjectName(_.kebabCase(defaultProjectName))

  const { npm, gitLocation, repoOwner, repoName, repoPrivateLocation, website, type, node, vite, email, description, license, keywords, port } = await inquirer.prompt([{
    default: defaultProjectName,
    name: 'npm',
    message: 'Your Project NPM name?',
    type: 'input',
    when: () => !isProd()
  }, {
    choices: [
      { name: 'Github', value: 'github' },
      { name: 'Private Repo', value: 'private-repo' }
    ],
    default: 0,
    name: 'gitLocation',
    message: 'Where are we storing this code today?',
    type: 'list',
    filter (val: string) { return val.toLowerCase() }
  }, {
    type: 'input',
    name: 'repoOwner',
    message: 'Repository Owner (e.g. https://github.com/{OWNER}/{PROJECT NAME}):',
    default: 'Bugs5382', // this is me!
    when: (answers) => answers.gitLocation === 'github'
  }, {
    type: 'input',
    name: 'repoName',
    message: 'Repository Project Name (e.g. https://github.com/{OWNER}/{PROJECT NAME}):',
    validate: (result) => {
      if (result === '') {
        return 'Error: Please enter a repo name. If the repo does not exist, it will be created for you.'
      } else {
        return true
      }
    },
    when: (answers) => answers.gitLocation === 'github',
    filter (val: string) { return val.toLowerCase() }
  }, {
    type: 'input',
    name: 'repoPrivateLocation',
    message: 'Full URL of Git Repo:',
    when: (answers) => answers.gitLocation !== 'github'
  }, {
    name: 'website',
    message: 'Homepage of Author:',
    filter (val: string) { return val.toLowerCase() }
  }, {
    choices: ['NodeJS', 'Vite/React'],
    default: 0,
    name: 'type',
    message: 'What type of app are we creating today?',
    type: 'list',
    filter (val: string) { return val.toLowerCase() }
  }, {
    choices: [
      { name: 'Fastify GraphQL Controller', value: 'fastify-graphql-controller' },
      { name: 'Fastify GraphQL Microservice', value: 'fastify-graphql-microservice' },
      { name: 'Fastify Standalone NPM Package', value: 'fastify-npm-package' },
      { name: 'Standalone NPM Package', value: 'npm-package' }
    ],
    default: 1,
    name: 'node',
    message: 'What type of app are we creating today?',
    type: 'list',
    when: (answers) => answers.type === 'nodejs'
  }, {
    choices: [
      { name: 'Vite with React + SWC', value: 'vite-react-swc' }
    ],
    default: 0,
    name: 'vite',
    message: 'What type of app are we creating today?',
    type: 'list',
    when: (answers) => answers.type === 'vite/react'
  }, {
    default: 3000,
    name: 'port',
    type: 'input',
    message: 'Provide the port app should run under during development:',
    when: (answers) => answers.node === 'fastify-graphql-controller' || answers.node === 'fastify-graphql-microservice'
  }, {
    name: 'description',
    type: 'input',
    message: 'Provide a description:',
    validate: (input) => typeof input !== 'undefined'
  }, {
    name: 'keywords',
    type: 'input',
    message: 'Package keywords (comma to split):',
    filter (words) {
      return typeof words !== 'undefined' ? words.split(/\s*,\s*/g) : undefined
    },
    validate: (input) => typeof input !== 'undefined'
  }, {
    name: 'email',
    type: 'input',
    message: 'Provide a email address:'
  }, {
    choices: licenseChoices,
    default: 1,
    name: 'license',
    message: 'What type of license does this app follow?',
    type: 'list'
  }]) as Partial<any>

  const temp: string = !isProd() ? 'temp/' : ''

  // Create folder
  const folder: string = options.sameFolder === true ? '' : typeof npmName !== 'undefined' ? npmName : npm
  const cwd = path.join(process.cwd(), `${temp}/${folder}`)
  fs.mkdirSync(cwd, { recursive: true })
  process.chdir(cwd)

  if (fs.existsSync('package.json')) {
    const { continueAnyway } = await inquirer.prompt([{
      name: 'continueAnyway',
      message: 'package.json exists already. Continue?',
      default: false,
      type: 'confirm'
    }])

    if (continueAnyway === false) {
      process.exit()
    }
  }

  // GIT: Initial
  await git.init(cwd, 'initial')
  if (gitLocation === 'github' && typeof repoOwner !== 'undefined' && typeof repoName !== 'undefined') {
    await git.addRemote(cwd, repoOwner, repoName)
  }

  let gitUrl: string | undefined
  let gitIssues: string | undefined
  let gitReadme: string | undefined
  if (gitLocation === 'github') {
    gitUrl = `https://github.com/${repoOwner as string}/${repoName as string}`
    gitIssues = `${gitUrl}/issues`
    gitReadme = `${gitUrl}#readme`
  }

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
    gitUrl: typeof repoPrivateLocation !== 'undefined' ? repoPrivateLocation : gitUrl,
    license,
    keywords
  }, {
    type,
    node,
    vite,
    options: { port }
  })
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 4))

  // Move Templates
  await generateTemplate({
    type,
    node,
    vite
  }, {
    npm: typeof npmName !== 'undefined' ? npmName : npm,
    author: DEFAULT_NPM.author.name,
    repoOwner,
    description,
    homepage: website,
    license
  })

  // Get Dependencies
  const packages = returnDependencies({
    type,
    node,
    vite
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
