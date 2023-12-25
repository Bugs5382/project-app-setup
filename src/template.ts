import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GenerateInput, TemplateCopyOptions } from './types.js'

// @ts-expect-error
const dirName = path.dirname(fileURLToPath(import.meta.url))

/**
 * Recurse Dir
 * @since 1.0.0
 * @param dir
 */
const recurseDir = async (dir: string): Promise<string[]> => {
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
 * Copy all files from a given source folder into the target folder.
 * @description This will recurse into subfolders.
 * @since 1.0.0
 * @param source The source folder.
 * @param dest The destination folder.
 * @param options
 * @returns an array of relative filenames that were added.
 */
const copyTemplateFiles = async (
  source: string,
  dest: string,
  options: TemplateCopyOptions = {}
): Promise<string[]> => {
  const rename = typeof options.rename !== 'undefined' ? options.rename : {}

  const resolvedSource = path.resolve(source)
  const templateFileNames = await recurseDir(resolvedSource)

  const filesAdded: string[] = []

  for (const file of templateFileNames) {
    let contents = fs.readFileSync(file, { encoding: 'utf8' })

    // Figure out where we're writing this file.
    let baseFile = file.replace(`${resolvedSource}/`, '')

    // make sure we remove ts-nocheck from files
    if ((baseFile.substring(baseFile.length - 2, baseFile.length) === 'ts') || baseFile.substring(baseFile.length - 3, baseFile.length) === 'tsx') {
      const regex = /\/\/ @ts-nocheck\n/g
      contents = contents.replace(regex, '')
    }

    if (typeof rename[baseFile] !== 'undefined') {
      baseFile = rename[baseFile]
    }

    const destFile = path.join(dest, baseFile)
    fs.mkdirSync(path.dirname(destFile), { recursive: true })
    if (!destFile.includes('.keepfolder')) {
      fs.writeFileSync(destFile, contents)
      filesAdded.push(baseFile)
    }
  }

  return filesAdded.sort()
}

/**
 * Generate Template
 * @since 1.0.0
 * @param input
 */
export const generateTemplate = async (input: GenerateInput): Promise<void> => {
  // shared among all projects
  await copyTemplateFiles(
    path.join(dirName, '..', 'template', '__shared__'),
    process.cwd()
  )

  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'fastify-graphql-controller': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', '__shared__fastify__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' }
            }
          )
          // copy fastify-graphql-controller folder
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', 'fastify-graphql-controller'),
            process.cwd()
          )
          return
        }
        case 'fastify-graphql-microservice': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', '__shared__fastify__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' }
            }
          )
          // copy fastify-graphql-microservice folder
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', 'fastify-graphql-microservice'),
            process.cwd()
          )
          return
        }
        case 'fastify-npm-package': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', '__shared__npm__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' }
            }
          )
          // copy npm folder
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', 'npm-fastify-plugin'),
            process.cwd()
          )
          return
        }
        case 'npm-package': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', '__shared__npm__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' }
            }
          )
          // copy npm folder
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', 'npm'),
            process.cwd()
          )
          return
        }
      }
      break
    }
    case 'vite/react': {
      switch (input.vite) {
        case 'vite-react-swc': {
          // copy npm folder
          await copyTemplateFiles(
            path.join(dirName, '..', 'template', 'vite'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' }
            }
          )
          return
        }
      }
      break
    }
    default: {
      throw new Error('Unknown selection. Try again.')
    }
  }
  // if we made it this far, major issue.
  throw new Error('Unknown selection. Try again.')
}
