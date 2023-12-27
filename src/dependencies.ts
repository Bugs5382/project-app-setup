import { Dependencies, GenerateInput } from './types.js'

const sharedDev: string[] = [
  '@semantic-release/changelog',
  '@semantic-release/commit-analyzer',
  '@semantic-release/git',
  '@semantic-release/release-notes-generator',
  '@the-rabbit-hole/semantic-release-config',
  '@types/node',
  'clean-publish',
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

const FASTIFY_GRAPHQL_CONTROLLER: Dependencies = {
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

const FASTIFY_GRAPHQL_MICROSERVICES: Dependencies = {
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

const FASTIFY_NPM_PACKAGE: Dependencies = {
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

const NPM_PACKAGE: Dependencies = {
  dependencies: [],
  devDependencies: [
    ...sharedDev,
    'ts-jest',
    '@types/jest',
    'jest',
    'jest-ts-webcompat-resolver'
  ]
}

const VITE_REACT_SWC: Dependencies = {
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
    'autoprefixer',
    'prettier-plugin-tailwindcss',
    'tailwindcss',
    'vite'
  ]
}

/**
 * @since 1.0.0
 * @param input
 */
export const returnDependencies = (input: GenerateInput): Dependencies => {
  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'fastify-graphql-controller':
          return FASTIFY_GRAPHQL_CONTROLLER
        case 'fastify-graphql-microservice':
          return FASTIFY_GRAPHQL_MICROSERVICES
        case 'fastify-npm-package':
          return FASTIFY_NPM_PACKAGE
        case 'npm-package':
          return NPM_PACKAGE
      }
      break
    }
    case 'vite/react': {
      switch (input.vite) {
        case 'vite-react-swc':
          return VITE_REACT_SWC
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
