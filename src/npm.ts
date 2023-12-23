import childProcess from 'node:child_process'
import { promisify } from 'node:util'
import {
  GeneratePackageJsonInputWithOptions,
  GeneratePackageJsonParams
} from './types.js'

const execFile = promisify(childProcess.execFile)

export const generatePackageJson = (params: GeneratePackageJsonParams, input: GeneratePackageJsonInputWithOptions): any => {
  let finalPackage: any = null

  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'fastify-graphql-controller':
        case 'fastify-graphql-microservice':{
          if (typeof input.options.port === 'undefined') {
            throw new Error('Port not defined.')
          }

          finalPackage = {
            type: 'module',
            main: 'app.ts',
            scripts: {
              clean: 'rm -rf coverage docs build temp',
              build: 'tsc -p tsconfig.json',
              'build:prod': 'tsc -p tsconfig.prd.json',
              'build:watch': 'tsc -w -p tsconfig.json',
              dev: `fastify start -p ${input.options.port} -w -l debug -P build/app.js`,
              'dev:trace': `fastify start -p ${input.options.port} -w -l trace -P build/app.js`,
              'dev:expose': `fastify start -a 0.0.0.0 -p ${input.options.port} -w -l debug -P build/app.js`,
              prod: 'fastify start -l info -P build/app.js',
              lint: 'ts-standard | snazzy',
              'lint:fix': 'ts-standard --fix --parser @typescript-eslint/parser | snazzy',
              typedoc: 'typedoc',
              'typedoc:watch': 'typedoc -watch',
              update: 'npx npm-check-updates -u && npm install'
            }
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
            ],
            scripts: {
              clean: 'rm -rf coverage docs lib temp',
              build: 'tsc && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && ./bin/build-types.sh',
              'build:watch': 'tsc -w',
              lint: 'ts-standard | snazzy',
              'lint:fix': 'ts-standard --fix | snazzy',
              pack: 'npm pack',
              prepublishOnly: 'npm run clean && npm run build && npm run test:ci && npm run pack',
              test: 'jest',
              'test:open': 'jest --detectOpenHandles',
              'test:watch': 'jest --watch',
              'test:ci': 'jest --ci',
              'test:coverage': 'jest --coverage',
              typedoc: 'typedoc',
              'typedoc:watch': 'typedoc -watch',
              'semantic-release': 'semantic-release',
              'semantic-release:dry-run': 'semantic-release --dry-run',
              update: 'npx npm-check-updates -u && npm run update:post-update',
              'update:post-update': 'npm ci && npm run test:ci'
            }
          }
          break
        }
      }
      break
    }
    case 'vite/react:': {
      switch (input.vite) {
        case 'vite-react-swc':{
          finalPackage = {
            type: 'module',
            scripts: {
              build: 'tsc && vite build',
              dev: 'vite',
              'dev:expose': 'vite --host',
              format: 'prettier --write "public/**/*.json" "src/**/*.{ts,tsx,css}"',
              'format:check': 'prettier --check  "src/**/*.{ts,tsx,css,json}" "public/**/*.json"',
              lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
              'lint:fix': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix',
              preview: 'vite preview'
            }
          }
          break
        }
      }
      break
    }
    default: {
      throw new Error('Unknown selection. Try again.')
    }
  }

  const packageJson: any = {
    name: params.name,
    version: '0.0.0-development',
    description: params.description,
    ...finalPackage,
    keywords: params.keywords,
    author: params.author,
    license: 'MIT'
  }

  return { ...packageJson }
}

export const installDeps = async (dependencies: string[], options: { dev?: boolean } = {}): Promise<void> => {
  const args: string[] = ['install']
  if (options.dev === true) {
    args.push('--save-dev')
  }

  await execFile('npm', [...args, ...dependencies])
}
