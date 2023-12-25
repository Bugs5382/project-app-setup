// @ts-nocheck
import fp from 'fastify-plugin'
import customHealthCheck, { CustomHealthCheckOptions } from 'fastify-custom-healthcheck'

export default fp<CustomHealthCheckOptions>((fastify, opts, done) => {
  void fastify.register(customHealthCheck)

  void fastify.ready().then(() => {
    fastify.log.debug('[cmdb-health] Started Health')
  })

  done()
})
