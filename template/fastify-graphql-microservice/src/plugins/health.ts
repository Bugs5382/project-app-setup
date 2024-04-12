// @ts-nocheck
import fp from 'fastify-plugin'
import customHealthCheck, { CustomHealthCheckOptions } from 'fastify-custom-healthcheck'

export default fp<CustomHealthCheckOptions>(async (fastify) => {
  void fastify.register(customHealthCheck)

  void fastify.ready().then(() => {
    fastify.log.debug('[cmdb-health] Started Health')

    fastify.addHealthCheck('mongodb', async () => {
      // @ts-expect-error topology doesn't exist in the types for some odd reason, but this is valid
      return fastify.mongo.client.topology.isConnected()
    })

    fastify.addHealthCheck('rabbitmq', async () => {
      return typeof fastify.rabbitmq.ready
    })

    fastify.addHealthCheck('redis', async () => {
      return typeof fastify.redis.ready
    })
  })
})
