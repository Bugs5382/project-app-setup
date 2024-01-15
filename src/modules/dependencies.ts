import {
  EMPTY_PROJECT,
  FASTIFY_GRAPHQL_CONTROLLER,
  FASTIFY_GRAPHQL_MICROSERVICES,
  FASTIFY_NPM_PACKAGE,
  NPM_PACKAGE,
  VITE_REACT_SWC
} from './constants.js'
import { Dependencies, GenerateInput } from './types.js'

/**
 * @since 1.0.0
 * @param input
 */
export const returnDependencies = (input: GenerateInput): Dependencies => {
  switch (input.type) {
    case 'nodejs': {
      switch (input.node) {
        case 'empty-project':
          return EMPTY_PROJECT
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
