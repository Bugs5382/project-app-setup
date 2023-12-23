#!/usr/bin/env node

// start of imports
import * as fs from 'fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import askNpmName from 'inquirer-npm-name'
import path from 'node:path'
import { DEFAULT_NPM } from './constants.js'
import { returnDependencies } from './dependencies.js'
import { generatePackageJson, installDeps } from './npm.js'

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
 * @since 1.0.0
 */
const main = async (): Promise<void> => {
  const npmName = await getProjectName(_.kebabCase('project-app-setup'))

  console.log(npmName)

  const { type, node, vite, description, keywords } = await inquirer.prompt(
    [{
      choices: ['NodeJS', 'Vite/React'],
      default: 0,
      name: 'type',
      message: 'What type of app are we creating today?',
      type: 'list',
      filter (val) {
        return val.toLowerCase()
      }
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
      name: 'description',
      type: 'input',
      message: 'Provide a description:',
      validate: (input) => typeof input !== 'undefined'
    }, {
      name: 'keywords',
      type: 'input',
      message: 'Provide keywords (seperated by `,`):',
      validate: (input) => typeof input !== 'undefined'
    }]) as Partial<any>

  const temp: string = process.env.NODE_ENV !== 'production' ? 'temp/' : ''

  let cwd: string = process.cwd()
  if (typeof npmName !== 'undefined') {
    cwd = path.join(process.cwd(), `${temp}/${npmName}`)
    fs.mkdirSync(cwd, { recursive: true })
  }
  process.chdir(cwd)

  const packageJson = generatePackageJson({
    ...DEFAULT_NPM,
    name: npmName,
    description,
    keywords: keywords.split(',')
  }, {
    type,
    node,
    vite
  })

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 4))

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
