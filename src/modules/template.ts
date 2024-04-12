import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyTemplateFiles } from '../helpers/copyTemplateFiles.js'
import { GenerateInput } from '../declaration/types.js'
import { execFile } from './git.js'

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
    { replaceString: '<%- repoOwner %>', var: typeof replacement.repoOwner !== 'undefined' ? replacement.repoOwner : '' },
    { replaceString: '<%- author %>', var: typeof replacement.author !== 'undefined' ? replacement.author : '' },
    { replaceString: '<%- description %>', var: typeof replacement.description !== 'undefined' ? replacement.description : '' },
    { replaceString: '<%- homepage %>', var: typeof replacement.homepage !== 'undefined' ? replacement.homepage : '' },
    { replaceString: '<%- license %>', var: typeof replacement.license !== 'undefined' ? replacement.license : '' }
  ]

  if (input.git) {
    if (input.github) {
      await copyTemplateFiles(
        path.join(dirName, '..', '..', 'template', '__github__'),
        process.cwd(),
        {
          replace: createReplace
        }
      )
    }
  }

  // shared among all projects
  if (input.node !== 'empty-project') {
    await copyTemplateFiles(
      path.join(dirName, '..', '..', 'template', '__shared__'),
      process.cwd(),
      {
        replace: createReplace
      }
    )
  }

  switch (input.type) {
    /**
     * Node JS
     */

    case 'nodejs': {
      switch (input.node) {
        case 'empty-project': {
          return
        }

        /**
         * Fastify
         */

        case 'fastify-graphql-controller': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__fastify__'),
            process.cwd(),
            {
              rename: { '/gitignore': '.gitignore' },
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
              rename: { '/gitignore': '.gitignore' },
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
              rename: { '/gitignore': '.gitignore' },
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
          // exec file
          await execFile('chmod', ['+x', 'bin/build-types.sh'], { cwd: process.cwd() })
          return
        }

        /**
         * NPM
         */

        case 'npm-package': {
          // shared among all projects
          await copyTemplateFiles(
            path.join(dirName, '..', '..', 'template', '__shared__npm__'),
            process.cwd(),
            {
              rename: { '/gitignore': '.gitignore' },
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
          // exec file
          await execFile('chmod', ['+x', 'bin/build-types.sh'], { cwd: process.cwd() })
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
