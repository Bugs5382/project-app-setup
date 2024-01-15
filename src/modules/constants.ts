import { Dependencies } from './types'

export const DEFAULT_NPM = {
  author: {
    name: 'Shane Froebel'
    // url: 'https://therabbithole.com/' // website is not online yet...
  }
}

export const CLI_PROGRESS = (area: string): any => {
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
    '@types/jest',
    'npm-check-updates',
    'npm-package-json-lint',
    'pre-commit',
    'jest',
    'jest-ts-webcompat-resolver',
    'snazzy',
    'ts-node',
    'ts-jest',
    'ts-standard',
    'tsd',
    'typedoc',
    'typescript'
  ]
}

export const sharedDev: string[] = [
  '@semantic-release/changelog',
  '@semantic-release/commit-analyzer',
  '@semantic-release/git',
  '@semantic-release/release-notes-generator',
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
    'fastify-plugin'
  ],
  devDependencies: [
    ...sharedDev
  ]
}

export const FASTIFY_GRAPHQL_MICROSERVICES: Dependencies = {
  dependencies: [
    '@fastify/autoload',
    '@fastify/mongodb',
    '@mercuriusjs/federation',
    'fastify',
    'fastify-cli',
    'fastify-custom-healthcheck',
    'fastify-plugin',
    'fastify-rabbitmq',
    'mercurius-codegen'
  ],
  devDependencies: [
    ...sharedDev
  ]
}

export const FASTIFY_NPM_PACKAGE: Dependencies = {
  dependencies: [
    '@fastify/error',
    'fastify-plugin'
  ],
  devDependencies: [
    ...sharedDev,
    'fastify',
    'ts-jest',
    '@types/jest',
    'jest',
    'jest-ts-webcompat-resolver'
  ]
}

export const NPM_PACKAGE: Dependencies = {
  dependencies: [],
  devDependencies: [
    ...sharedDev,
    'ts-jest',
    '@types/jest',
    'jest',
    'jest-ts-webcompat-resolver'
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
    ...sharedDev,
    '@types/react',
    '@types/react-dom',
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
