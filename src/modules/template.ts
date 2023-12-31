import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyTemplateFiles } from './helpers.js'
import { GenerateInput } from './types.js'

const dirName = path.dirname(fileURLToPath(import.meta.url))

/**
 * Generate Template
 * @since 1.0.0
 * @param input
 * @param replacement
 */
export const generateTemplate = async (input: GenerateInput, replacement?: any): Promise<void> => {
  const createReplace = [
    { replaceString: '<%- npm %>', var: typeof replacement.npm !== 'undefined' ? replacement.npm : '' },
    { replaceString: '<%- gitHubAuthor %>', var: typeof replacement.gitHubAuthor !== 'undefined' ? replacement.gitHubAuthor : '' },
    { replaceString: '<%- author %>', var: typeof replacement.author !== 'undefined' ? replacement.author : '' },
    { replaceString: '<%- description %>', var: typeof replacement.description !== 'undefined' ? replacement.description : '' },
    { replaceString: '<%- homepage %>', var: typeof replacement.homepage !== 'undefined' ? replacement.homepage : '' },
    { replaceString: '<%- license %>', var: typeof replacement.license !== 'undefined' ? replacement.license : '' }
  ]

  // shared among all projects
  await copyTemplateFiles(
    path.join(dirName, '..', '..', 'template', '__shared__'),
    process.cwd(),
    {
      replace: createReplace
    }
  )

  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'fastify-graphql-controller': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__fastify__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' },
              replace: createReplace
            }
          )
          // copy fastify-graphql-controller folder
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', 'fastify-graphql-controller'),
            process.cwd(),
            {
              replace: createReplace
            }
          )
          return
        }
        case 'fastify-graphql-microservice': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__fastify__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' },
              replace: createReplace
            }
          )
          // copy fastify-graphql-microservice folder
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', 'fastify-graphql-microservice'),
            process.cwd(),
            {
              replace: createReplace
            }
          )
          return
        }
        case 'fastify-npm-package': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__npm__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' },
              replace: createReplace
            }
          )
          // copy npm folder
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', 'npm-fastify-plugin'),
            process.cwd(),
            {
              replace: createReplace
            }
          )
          return
        }
        case 'npm-package': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__npm__'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' },
              replace: createReplace
            }
          )
          // copy npm folder
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', 'npm'),
            process.cwd(),
            {
              replace: createReplace
            }
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
            path.join(dirName, '..', '..', 'template', 'vite'),
            process.cwd(),
            {
              rename: { gitignore: '.gitignore' },
              replace: createReplace
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
