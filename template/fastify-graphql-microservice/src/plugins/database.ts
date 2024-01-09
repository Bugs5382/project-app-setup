// @ts-nocheck
import { FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'
import fastifyMongodb from '@fastify/mongodb'
import { accessEnv } from '../helpers/accessEnv.js'

export default fp<FastifyPluginOptions>(async (fastify, opts) => {
  // void fastify.register(fastifyMongodb, {
  //   forceClose: process.env.NODE_ENV !== 'production',
  //   url: accessEnv('MONGODB_URI', 'mongodb://localhost:27017/'),
  //   database: accessEnv('MONGODB_DATABASE', '')
  // })

  void fastify.ready().then(() => {
    fastify.log.debug('[<%- npm %>-database] Started Database: Starting Remote Connection')
  })
})
