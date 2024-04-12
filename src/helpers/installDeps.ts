import cliProgress from "cli-progress";
import childProcess from "node:child_process";
import {promisify} from "node:util";
import {CLI_PROGRESS, isProd} from "../modules/constants";

const execFile = promisify(childProcess.execFile)

/**
 * @since 1.0.0
 * @param dependencies
 * @param options
 */
export const installDeps = async (dependencies: string[], options: { dev?: boolean } = {}): Promise<void> => {
  const args: string[] = ['install']
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

  if (options.dev === true) {
    args.push('--save-dev')
  }

  if (dependencies.length > 0) {
    const bar = new cliProgress.SingleBar({}, CLI_PROGRESS(options.dev === true ? 'NPM DEV' : 'NPM'))
    bar.start(dependencies.length, 0)

    let value = 0

    for (const depend of dependencies) {
      value++
      if (isProd()) {
        await execFile(npmCmd, [...args, depend])
      }
      bar.update(value)
      if (value >= bar.getTotal()) {
        bar.stop()
      }
    }
  }
}