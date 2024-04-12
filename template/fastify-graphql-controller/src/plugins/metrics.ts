// @ts-nocheck
import fp from 'fastify-plugin'
import metricsPlugin, { IMetricsPluginOptions } from 'fastify-metrics'
export default fp<IMetricsPluginOptions>(async (fastify) => {
  void fastify.register(metricsPlugin, { endpoint: '/metrics' })
})
