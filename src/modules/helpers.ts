import cliProgress from 'cli-progress'
import fs from 'fs'
import path from 'node:path'
import { CLI_PROGRESS } from './constants.js'
import { TemplateCopyOptions } from './types.js'

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
