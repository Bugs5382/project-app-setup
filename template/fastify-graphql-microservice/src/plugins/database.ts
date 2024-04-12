// @ts-nocheck
import { FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import fastifyMongodb from '@fastify/mongodb'
import { accessEnv } from '../helpers/accessEnv.js'

export default fp<FastifyPluginOptions>(async (fastify, opts) => {
  // const MONGODB_HOST = accessEnv('MONGODB_HOST', 'localhost')
  // const MONGODB_PORT = accessEnv('MONGODB_PORT', '27017')
  //
  // void fastify.register(fastifyMongodb, {
  //   forceClose: process.env.NODE_ENV !== 'production',
  //   url: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/`,
  //   database: accessEnv('MONGODB_DATABASE', 'cmdb')
  // })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-database] Started Database: Starting Remote Connection')
  })
})
