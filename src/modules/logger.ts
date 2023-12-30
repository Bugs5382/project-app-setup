import pino from 'pino'
import Logger = pino.Logger

/**
 * @since 1.0.0
 * @param level
 */
export const logger = (level?: string): Logger<never> => pino({
  level: typeof level !== 'undefined' ? level : 'info'
})
