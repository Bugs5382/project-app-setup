import cliProgress from 'cli-progress'
import fs from 'fs'
import inquirer from 'inquirer'
import askNpmName from 'inquirer-npm-name'
import childProcess from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { CLI_PROGRESS } from './constants.js'
import { TemplateCopyOptions } from './types.js'

const execFile = promisify(childProcess.execFile)

/**
 * Recurse Dir
 * @since 1.0.0
 * @param dir
 */
export const recurseDir = async (dir: string): Promise<string[]> => {
  const files = fs.readdirSync(dir)
  const result = []
  for (const file of files) {
    const resolved = path.join(dir, file)
    const stat = fs.statSync(resolved)
    if (stat.isFile()) {
      result.push(resolved)
    } else if (stat.isDirectory()) {
      result.push(...(await recurseDir(resolved)))
    }
  }
  return result
}

/**
 * Count Occurrences
 * @since 1.2.1
 * @param array
 * @param value
 */
export const getOccurrence = (array: any, value: any): number => {
  return array.filter((v: any) => (v.includes(value) === true)).length
}

/**
 * Copy Template File
 * @since 1.3.0
 * @param file The source file
 * @param source
 * @param dest The dest where the file should go.
 * @param options Options
 * @return boolean
 */
export const copyTemplateFile = async (
  file: string,
  source: string,
  dest: string,
  options: TemplateCopyOptions = {}
): Promise<boolean> => {
  const rename = typeof options.rename !== 'undefined' ? options.rename : {}
  const stringReplacement = typeof options.replace !== 'undefined' ? options.replace : []

  const resolvedSource = path.resolve(source)

  let contents = fs.readFileSync(`${resolvedSource}/${file}`, { encoding: 'utf8' })

  // Figure out where we're writing this file.
  let baseFile = file.replace(`${resolvedSource}/`, '')

  // make sure we remove ts-nocheck from files
  if ((baseFile.substring(baseFile.length - 2, baseFile.length) === 'ts') || baseFile.substring(baseFile.length - 3, baseFile.length) === 'tsx') {
    const regex = /\/\/ @ts-nocheck\n/g
    contents = contents.replace(regex, '')
  }

  // replace strings
  stringReplacement.forEach(string => {
    const regex = new RegExp(`${string.replaceString}`, 'g')
    contents = contents.replace(regex, string.var)
  })

  if (typeof rename[baseFile] !== 'undefined') {
    baseFile = rename[baseFile]
  }

  const destFile = path.join(dest, baseFile)

  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.writeFileSync(destFile, contents)

  return true
}

/**
 * Copy all files from a given source folder into the target folder.
 * @description This will recurse into subfolders.
 * @since 1.0.0
 * @param source The source folder.
 * @param dest The destination folder.
 * @param options
 * @returns an array of relative filenames that were added.
 */
export const copyTemplateFiles = async (
  source: string,
  dest: string,
  options: TemplateCopyOptions = {}
): Promise<string[]> => {
  const rename = typeof options.rename !== 'undefined' ? options.rename : {}
  const stringReplacement = typeof options.replace !== 'undefined' ? options.replace : []

  const resolvedSource = path.resolve(source)
  const templateFileNames = await recurseDir(resolvedSource)

  const totalOfGitKeep = getOccurrence(templateFileNames, '.keepfolder')

  const bar = new cliProgress.SingleBar({}, CLI_PROGRESS('Copy Directory Files'))
  bar.start(templateFileNames.length - totalOfGitKeep, 0)

  let value = 0

  const filesAdded: string[] = []

  for (const file of templateFileNames) {
    value++

    let contents = fs.readFileSync(file, { encoding: 'utf8' })

    // Figure out where we're writing this file.
    let baseFile = file.replace(`${resolvedSource}/`, '')

    // make sure we remove ts-nocheck from files
    if ((baseFile.substring(baseFile.length - 2, baseFile.length) === 'ts') || baseFile.substring(baseFile.length - 3, baseFile.length) === 'tsx') {
      const regex = /\/\/ @ts-nocheck\n/g
      contents = contents.replace(regex, '')
    }

    // replace strings
    stringReplacement.forEach(string => {
      const regex = new RegExp(`${string.replaceString}`, 'g')
      contents = contents.replace(regex, string.var)
    })

    if (typeof rename[baseFile] !== 'undefined') {
      baseFile = rename[baseFile]
    }

    const destFile = path.join(dest, baseFile)
    fs.mkdirSync(path.dirname(destFile), { recursive: true })
    if (!destFile.includes('.keepfolder')) {
      fs.writeFileSync(destFile, contents)
      filesAdded.push(baseFile)
      bar.update(value)
      if (value >= bar.getTotal()) {
        bar.stop()
      }
    }
  }

  return filesAdded.sort()
}

/**
 * Parse CLI options
 * @since 1.5.0
 */
export const parseOptions = async (): Promise<{ run: string, type?: string }> => {
  const options = await yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('run', {
      alias: 'r',
      type: 'string',
      demandOption: true,
      default: 'start',
      description: 'Action:\n start\n fix\n update'
    })
    .option('type', {
      alias: 't',
      type: 'string',
      description: 'Type:\n fastify-controller\n fastify-microservice\n fastify-plugin\n npm\n vite-react'
    })
    .option('h', {
      alias: 'help',
      description: 'display help message'
    })
    .strict()
    .wrap(null)
    .parseAsync()

  return { run: options.run, type: options.type }
}

/**
 * @since 1.0.0
 * @param defaultProjectName
 */
export const getProjectName = async (defaultProjectName: string): Promise<string> => {
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
 * @param dependencies
 * @param options
 */
export const installDeps = async (dependencies: string[], options: { dev?: boolean } = {}): Promise<void> => {
  const args: string[] = ['install']
  if (options.dev === true) {
    args.push('--save-dev')
  }

  if (dependencies.length > 0) {
    const bar = new cliProgress.SingleBar({}, CLI_PROGRESS(options.dev === true ? 'NPM DEV' : 'NPM'))
    bar.start(dependencies.length, 0)

    let value = 0

    for (const depend of dependencies) {
      value++
      if (typeof process.env.NODE_ENV === 'undefined') {
        await execFile('npm', [...args, depend])
      }
      bar.update(value)
      if (value >= bar.getTotal()) {
        bar.stop()
      }
    }
  }
}
