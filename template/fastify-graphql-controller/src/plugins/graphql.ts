// @ts-nocheck
import fp from 'fastify-plugin'
import mercuriusGateway, { MercuriusGatewayOptions } from '@mercuriusjs/gateway'
import { accessEnv } from '../helpers/accessEnv.js'

export default fp<MercuriusGatewayOptions>(async (fastify) => {
  // const GRAPHQL_HOST = accessEnv('GRAPHQL_HOST', 'localhost')
  // const GRAPHQL_PORT = parseInt(accessEnv('GRAPHQL_PORT', '3000'))

  // await fastify.register(mercuriusGateway, {
  //   gateway: {
  //     services: [{
  //       name: '<%- npm %>',
  //       collectors: {
  //         collectHeaders: true
  //       },
  //       rewriteHeaders: (headers) => {
  //         return headers
  //       },
  //       url: `http://${GRAPHQL_HOST}:${GRAPHQL_PORT}/graphql`,
  //       keepAlive: 10
  //     }]
  //   },
  //   graphiql: process.env.npm_lifecycle_event !== 'prod',
  //   jit: 1
  // })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-graphql] Started GraphQL Gateway')
  })
})
