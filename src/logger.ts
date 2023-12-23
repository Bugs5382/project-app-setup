import pino from 'pino'
import Logger = pino.Logger;

export const logger = (level?: string): Logger<never> => pino({
    level: typeof level !== 'undefined' ? level : 'info',
})