#!/usr/bin/env node

// start of imports
import * as fs from 'fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import askNpmName from 'inquirer-npm-name'
import path from 'node:path'
import { DEFAULT_NPM } from './constants.js'
import { returnDependencies } from './dependencies.js'
import { generateLicense, licenseChoices } from './license.js'
import { generatePackageJson, installDeps } from './npm.js'
import { generateTemplate } from './template.js'

/**
 * @since 1.0.0
 * @param defaultProjectName
 */
const getProjectName = async (defaultProjectName: string): Promise<string> => {
  const { npmName } = await askNpmName(
    {
      default: defaultProjectName,
      name: 'npmName',
      message: 'Your Project NPM name?',
      type: 'input'
    },
    inquirer
  )

  return npmName
}

/**
 * Main Executable Function
 * @description Runs by default.
 * @since 1.0.0
 */
export const main = async (): Promise<void> => {
  const defaultProjectName = _.kebabCase('project-app-setup')
  let npmName: string | undefined
  if (typeof process.env.NODE_ENV === 'undefined') {
    npmName = await getProjectName(defaultProjectName)
  }

  const { npm, website, type, node, vite, email, description, license, keywords, port } = await inquirer.prompt([{
    default: defaultProjectName,
    name: 'npm',
    message: 'Your Project NPM name?',
    type: 'input',
    when: () => typeof process.env.NODE_ENV !== 'undefined'
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
    name: 'repoName',
    message: 'Project Name:',
    default: npmName || defaultProjectName,
    when: (answers) => answers.gitLocation === 'github'
  }, {
    type: 'input',
    name: 'repoPrivateLocation',
    message: 'Full URL of Git Repo:',
    when: (answers) => answers.gitLocation !== 'github'
  }, {
    name: 'website',
    message: 'Homepage:',
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

  const temp: string = process.env.NODE_ENV === 'test' ? 'temp/' : ''

  // create folder
  let cwd: string = process.cwd()
  let folder = typeof npmName !== 'undefined' ? npmName : npm
  cwd = path.join(process.cwd(), `${temp}/${folder}`)
  fs.mkdirSync(cwd, { recursive: true })
  process.chdir(cwd)

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

  // Install Dependencies
  await installDeps(packages.dependencies)
  await installDeps(packages.devDependencies, { dev: true })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
