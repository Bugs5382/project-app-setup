import { Dependencies } from '../declaration/types.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const DEFAULT_NPM = {
  author: {
    name: 'Shane Froebel'
    // url: 'https://therabbithole.com/' // website is not online yet...
  }
}

export const cliProgressFunc = (area: string): any => {
  return {
    format: `${area} {bar}\u25A0 {percentage}% | ETA: {eta}s | {value}/{total}`,
    barCompleteChar: '\u25A0',
    barIncompleteChar: ' '
  }
}

export const EMPTY_PROJECT: Dependencies = {
  dependencies: [],
  devDependencies: [
    '@types/node',
    'npm-check-updates',
    'npm-package-json-lint',
    'pre-commit',
    'snazzy',
    'ts-node',
    'ts-standard',
    'tsd',
    'typedoc',
    'typescript'
  ]
}

export const SHARED_DEV: string[] = [
  '@semantic-release/changelog',
  '@semantic-release/git',
  '@the-rabbit-hole/semantic-release-config',
  '@types/node',
  'npm-check-updates',
  'npm-package-json-lint',
  'pre-commit',
  'semantic-release',
  'snazzy',
  'ts-node',
  'ts-standard',
  'tsd',
  'typedoc',
  'typescript'
]

export const FASTIFY_GRAPHQL_CONTROLLER: Dependencies = {
  dependencies: [
    '@fastify/autoload',
    '@fastify/cors',
    '@mercuriusjs/gateway',
    'fastify',
    'fastify-cli',
    'fastify-custom-healthcheck',
    'fastify-metrics',
    'fastify-plugin'
  ],
  devDependencies: [
    ...SHARED_DEV
  ]
}

export const FASTIFY_GRAPHQL_MICROSERVICES: Dependencies = {
  dependencies: [
    '@fastify/autoload',
    '@fastify/cors',
    '@fastify/mongodb',
    '@fastify/redis',
    '@mercuriusjs/federation',
    'fastify',
    'fastify-cli',
    'fastify-custom-healthcheck',
    'fastify-plugin',
    'fastify-rabbitmq',
    'fastify-metrics',
    'mercurius-codegen'
  ],
  devDependencies: [
    ...SHARED_DEV
  ]
}

export const FASTIFY_NPM_PACKAGE: Dependencies = {
  dependencies: [
    '@fastify/error',
    'fastify-plugin'
  ],
  devDependencies: [
    ...SHARED_DEV,
    'fastify',
    '@vitest/coverage-v8',
    '@vitest/ui',
    'vitest'
  ]
}

export const NPM_PACKAGE: Dependencies = {
  dependencies: [],
  devDependencies: [
    ...SHARED_DEV,
    '@vitest/coverage-v8',
    '@vitest/ui',
    'vitest'
  ]
}

export const VITE_REACT_SWC: Dependencies = {
  dependencies: [
    '@apollo/client',
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-regular-svg-icons',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/react-fontawesome',
    'graphql',
    'i18next',
    'i18next-browser-languagedetector',
    'i18next-http-backend',
    'react',
    'react-dom',
    'react-i18next',
    'react-router-dom',
    'react-spinners',
    'react-toastify'
  ],
  devDependencies: [
    ...SHARED_DEV,
    '@types/react',
    '@types/react-dom',
    '@vitejs/plugin-basic-ssl',
    '@vitejs/plugin-react-swc',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'autoprefixer',
    'prettier-plugin-tailwindcss',
    'tailwindcss',
    'vite'
  ]
}

export const isProd = (): boolean => process.env.NODE_ENV !== 'test'

export const dirName = path.dirname(fileURLToPath(import.meta.url))
