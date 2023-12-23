import childProcess from 'node:child_process'
import { promisify } from 'node:util'
import { GeneratePackageJsonInput, GeneratePackageJsonParams } from './types.js'

const execFile = promisify(childProcess.execFile)

export const generatePackageJson = (params: GeneratePackageJsonParams, input: GeneratePackageJsonInput): any => {
  let finalPackage: any = null

  const packageJson: any = {
    name: params.name,
    description: params.description,
    keywords: params.keywords,
    version: '0.0.0-development',
    author: params.author,
    license: 'MIT'
  }

  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'fastify-graphql-controller':{
          finalPackage = {
            type: 'module'
          }
          break
        }
        case 'fastify-graphql-microservice':{
          finalPackage = {
            type: 'module'
          }
          break
        }
        case 'fastify-npm-package':
        case 'npm-package':{
          finalPackage = {
            module: './lib/esm/index.js',
            main: './lib/cjs/index.js',
            types: './lib/types/index.d.ts',
            exports: {
              '.': {
                types: './lib/types/index.d.ts',
                import: './lib/esm/index.js',
                require: './lib/cjs/index.js',
                default: './lib/cjs/index.js'
              }
            },
            files: [
              'lib/**/*'
            ]
          }
          break
        }
      }
      break
    }
    case 'vite/react:': {
      switch (input.vite) {
        case 'vite-react-swc':{
          finalPackage = {}
          break
        }
      }
      break
    }
    default: {
      throw new Error('Unknown selection. Try again.')
    }
  }

  return { ...packageJson, ...finalPackage }
}

export const installDeps = async (dependencies: string[], options: { dev?: boolean } = {}): Promise<void> => {
  const args: string[] = ['install']
  if (options.dev === true) {
    args.push('--save-dev')
  }

  await execFile('npm', [...args, ...dependencies])
}
