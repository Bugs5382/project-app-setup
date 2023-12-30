// @ts-nocheck
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { FastifyPluginOptions } from './decorate.js'
import { errors } from './errors.js'
import { validateOpts } from './validation.js'
export * from './types.js'

const decorateFastifyInstance = (fastify: FastifyInstance, options: FastifyPluginOptions, connection: any): void => {
  const {
    namespace = ''
  } = options

  if (typeof namespace !== 'undefined') {
    fastify.log.debug('[<%- npm %>] Namespace: %s', namespace)
  }
  if (typeof namespace !== 'undefined' && namespace !== '') {
    if (typeof fastify.rabbitmq === 'undefined') {
      fastify.decorate('APP', Object.create(null))
    }

    if (typeof fastify.rabbitmq[namespace] !== 'undefined') {
      throw new errors.FASTIFY_ERR_SETUP_ERRORS(`Already registered with namespace: ${namespace}`)
    }

    fastify.log.trace('[<%- npm %>] Decorate Fastify with Namespace: %', namespace)
    fastify.APP[namespace] = connection
  } else {
    if (typeof fastify.APP !== 'undefined') {
      throw new errors.FASTIFY_ERR_SETUP_ERRORS('Already registered.')
    }
  }

  if (typeof fastify.APP === 'undefined') {
    fastify.log.trace('[<%- npm %>] Decorate Fastify')
    fastify.decorate('APP', connection)
  }
}

/**
 * Main Function
 * @since 1.0.0
 * @example
 */
const fastifyPlugin = fp<FastifyPluginOptions>(async (fastify, opts) => {
  await validateOpts(opts)

  decorateFastifyInstance(fastify, opts, c)
})

export default fastifyPlugin

export { decorateFastifyInstance, FastifyRabbitMQOptions, ConnectionOptions }
