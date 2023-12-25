// @ts-nocheck
const cache: any = {};

export function accessEnv(key: string, defaultValue: any = null) {
  if (!(key in import.meta.env)) {
    if (defaultValue) return defaultValue;
    throw new Error(`${key} not found in import.meta.env!`);
  }

  if (cache[key]) {
    return cache[key];
  }

  cache[key] = import.meta.env[key];

  return import.meta.env[key];
}
