// @ts-nocheck
import fp from 'fastify-plugin'
import cors, { FastifyCorsOptions } from '@fastify/cors'

export default fp<FastifyCorsOptions>(async (fastify) => {
  await fastify.register(cors, {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    preflight: true
  })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-cors] Started Cors')
  })
})
