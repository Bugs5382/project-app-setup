// @ts-nocheck
import * as dotenv from 'dotenv'
const cache: any = {}

dotenv.config({ override: process.env.NODE_ENV !== 'production' })

export const accessEnv = (key: string, defaultValue: string = ''): string => {
  if (!(key in process.env)) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }
    throw new Error(`${key} not found in process.env!`)
  }

  if (typeof cache[key] !== 'undefined') {
    return cache[key]
  }

  cache[key] = process.env[key]

  return cache[key]
}
