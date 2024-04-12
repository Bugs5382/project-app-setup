import fs from 'fs'
import path from 'node:path'

/**
 * Recurse Dir
 * @since 1.0.0
 * @param dir
 */
export const recurseDir = async (dir: string): Promise<string[]> => {
  const files = fs.readdirSync(dir)
  const result = []
  for (const file of files) {
    const resolved = path.join(dir, file)
    const stat = fs.statSync(resolved)
    if (stat.isFile()) {
      result.push(resolved)
    } else if (stat.isDirectory()) {
      result.push(...(await recurseDir(resolved)))
    }
  }
  return result
}
