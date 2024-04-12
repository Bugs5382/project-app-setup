// @ts-nocheck
import { FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import { mercuriusFederationPlugin } from '@mercuriusjs/federation'
import { resolvers } from '../graphql/reporters.js'
import schema from '../graphql/schema.js'

export default fp<FastifyPluginOptions>(async (fastify, opts) => {
  // void fastify.register(mercuriusFederationPlugin, {
  //   schema,
  //   resolvers,
  //   graphiql: process.env.npm_lifecycle_event !== 'prod',
  //   jit: 1
  // })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-graphql] Started GraphQL')
  })
})
