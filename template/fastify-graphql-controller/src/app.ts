// @ts-nocheck
import { join, dirname } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
  // Place your custom options for app below here.
}

const options: AppOptions = {
  logger: {
    name: '<%- npm %>',
    level: 'info'
  }
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: join(dirName, 'plugins'),
    options: opts
  })
}

export default app
export { app, options }
