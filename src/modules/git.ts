import childProcess from 'node:child_process'
import { promisify } from 'node:util'

/** @internal */
export const execFile = promisify(childProcess.execFile)

/**
 * Init Git
 * @since 1.5.0
 * @param folder
 * @param step
 */
export async function init (folder: string, step: string): Promise<void> {
  try {
    switch (step) {
      case 'initial': {
        await execFile('git', ['init', '--initial-branch=develop'], { cwd: folder })
        break
      }
      case 'post': {
        await execFile('git', ['add', '.'], { cwd: folder })
        await execFile('git', ['commit', '-m', 'chore: initial creation [ci skip]'], { cwd: folder })
        await execFile('git', ['switch', '--orphan', 'main'], { cwd: folder })
        await execFile('git', ['commit', '--allow-empty', '-m', 'chore: initial creation [ci skip]'], { cwd: folder })
        await execFile('git', ['checkout', 'develop'], { cwd: folder })
        await execFile('git', ['-u', 'origin', 'main', 'develop'])
        break
      }
    }
  } catch (e: any) {
    // do nothing...
  }
}

/**
 * Add Git Remote for GitHub
 * @since 1.5.0
 * @param folder
 * @param repoOwner
 * @param repoName
 */
export async function addRemote (folder: string, repoOwner: string, repoName: string): Promise<void> {
  try {
    // If this succeeds, there's already a remote for `origin`.
    await execFile('git', ['config', 'remote.origin.url'], { cwd: folder })
  } catch {
    await execFile(
      'git',
      ['remote', 'add', 'origin', `https://github.com/${repoOwner}/${repoName}.git`],
      { cwd: folder }
    )
  }
}

export async function getUserName (): Promise<string | undefined> {
  try {
    const { stdout } = await execFile('git', ['config', 'user.name'])
    return stdout.trim()
  } catch {
    return undefined
  }
}

export async function getUserEmail (): Promise<string | undefined> {
  try {
    const { stdout } = await execFile('git', ['config', 'user.email'])
    return stdout.trim()
  } catch {
    return undefined
  }
}
