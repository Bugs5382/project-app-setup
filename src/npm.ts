import childProcess from 'node:child_process'
import { promisify } from 'node:util'
import { GeneratePackageJsonInput, GeneratePackageJsonParams } from './types.js'

const execFile = promisify(childProcess.execFile)

export const generatePackageJson = (_params: GeneratePackageJsonParams, input: GeneratePackageJsonInput): any => {
   // console.log(_params, input)

  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        default:
          break
      }
      break
    }
    case 'vite/react:': {
      break
    }
    default: {
      throw new Error('Unknown selection. Try again.')
    }
  }

  return {}
}

export const installDeps = async (dependencies: string[], options: { dev?: boolean } = {}): Promise<void> => {
  const args: string[] = ['install']
  if (options.dev === true) {
    args.push('--save-dev')
  }

  await execFile('npm', [...args, ...dependencies])
}
