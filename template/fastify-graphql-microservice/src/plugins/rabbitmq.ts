// @ts-nocheck
import { FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import fastifyRabbit from 'fastify-rabbitmq'
import { accessEnv } from '../helpers/accessEnv.js'

export default fp<FastifyPluginOptions>((fastify, opt, done) => {
  const RABBIT_MQ = accessEnv('RABBIT_MQ', 'localhost')

  void fastify.register(fastifyRabbit, {
    connection: `amqp://guest:guest@${RABBIT_MQ}`
  })

  void fastify.ready().then(async () => {
    fastify.log.debug('[rabbitmq] Started RabbitMQ')
  })

  done()
})
