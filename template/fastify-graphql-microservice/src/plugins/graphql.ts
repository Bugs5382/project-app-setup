// @ts-nocheck
import { FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { mercuriusFederationPlugin } from '@mercuriusjs/federation'
import { resolvers } from '../graphql/reporters.js'
import schema from '../graphql/schema.js'

export default fp<FastifyPluginOptions>((fastify, opts, done) => {
  void fastify.register(mercuriusFederationPlugin, {
    schema,
    resolvers,
    graphiql: process.env.NODE_ENV !== 'production',
    jit: 1
  })

  void fastify.ready().then(() => {
    fastify.log.debug('[graphql] Started GraphQL')
  })

  done()
})
