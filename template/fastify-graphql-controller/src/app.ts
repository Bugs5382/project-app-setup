// @ts-nocheck
import { dirname, join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export type AppOptions = {} & Partial<AutoloadPluginOptions>

const options: AppOptions = {}

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
