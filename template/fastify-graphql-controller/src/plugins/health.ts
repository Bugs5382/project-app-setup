// @ts-nocheck
import fp from 'fastify-plugin'
import customHealthCheck, { CustomHealthCheckOptions } from 'fastify-custom-healthcheck'

export default fp<CustomHealthCheckOptions>(async (fastify) => {
  await fastify.register(customHealthCheck)
})
