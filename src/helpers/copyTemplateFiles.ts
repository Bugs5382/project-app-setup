import cliProgress from 'cli-progress'
import fs from 'fs'
import path from 'node:path'
import { cliProgressFunc } from '../modules/constants.js'
import { TemplateCopyOptions } from '../declaration/types.js'
import { getOccurrence } from './getOccurrence.js'
import { recurseDir } from './recurseDir.js'

/**
 * Copy all files from a given source folder into the target folder.
 * @remarks This will recurse into subfolders.
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

  const bar = new cliProgress.SingleBar({}, cliProgressFunc('Copy Directory Files'))
  bar.start(templateFileNames.length - totalOfGitKeep, 0)

  let value = 0

  const filesAdded: string[] = []

  for (const file of templateFileNames) {
    value++

    let contents = fs.readFileSync(file, { encoding: 'utf8' })

    // Figure out where we're writing this file.
    let baseFile = file.replace(`${resolvedSource}`, '')

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
