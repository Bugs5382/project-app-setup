// @ts-nocheck
import createError from '@fastify/error'

export const errors = {
  /** Error if there is an invalid option used during registration. */
  FASTIFY_ERR_INVALID_OPTS: createError(
    'FASTIFY_ERR_INVALID_OPTS',
    'Invalid options: %s'
  ),
  /** Error if there is a setup error of the plugin itself. */
  FASTIFY_ERR_SETUP_ERRORS: createError(
    'FASTIFY_ERR_SETUP_ERRORS',
    'Setup error: %s'
  ),
  /** If an invalid usage error was done, this error would pop up. */
  FASTIFY_ERR_USAGE: createError(
    'FASTIFY_ERR_USAGE',
    'Usage error: %s'
  )
}
