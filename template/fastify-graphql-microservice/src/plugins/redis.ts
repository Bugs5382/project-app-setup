// @ts-nocheck
import { fastifyRedis, FastifyRedisPluginOptions } from '@fastify/redis'
import fp from 'fastify-plugin'
import { accessEnv } from '../helpers/accessEnv.js'

export default fp<FastifyRedisPluginOptions>(async (fastify) => {
  let processed: boolean = false
  const REDIS_HOST = accessEnv('REDIS_HOST', '0.0.0.0')

  void fastify.register(fastifyRedis, { host: REDIS_HOST, port: 6379, family: 4, closeClient: true })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-redis] Started Redis Plugin')

    if (!processed) {
      // setup default values
      processed = true // make sure it only happens once per cycle
    }
  })
})
