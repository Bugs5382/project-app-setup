import fs from 'fs'
import path from 'node:path'
import { TemplateCopyOptions } from '../declaration/types.js'

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
  fs.writeFileSync(destFile, contents)

  return true
}
