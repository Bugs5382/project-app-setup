// @ts-nocheck
import fp from 'fastify-plugin'
import customHealthCheck, { CustomHealthCheckOptions } from 'fastify-custom-healthcheck'

export default fp<CustomHealthCheckOptions>(async (fastify) => {
  void fastify.register(customHealthCheck)

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>--health] Started Health')
  })
})
