import fs from "fs";
import inquirer from "inquirer";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";

/**
 * Parse CLI options
 * @since 1.5.0
 */
export const parseOptions = async (): Promise<{
  run: string
  sameFolder?: boolean
  // type?: string
}> => {
  const options = await yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('same-folder', {
      alias: 'sf',
      type: 'boolean',
      description: 'Set this to have the app run withing the same folder your currently in.'
    })
    .option('run', {
      alias: 'r',
      type: 'string',
      demandOption: true,
      default: 'start',
      description: 'Action:\n start'
    })
    /*
    .option('type', {
      alias: 't',
      type: 'string',
      description: 'Type:\n fastify-controller\n fastify-microservice\n fastify-plugin\n npm\n vite-react'
    }) */
    .option('h', {
      alias: 'help',
      description: 'display help message'
    })
    .strict()
    .wrap(null)
    .parseAsync()

  // check to make sure that package.json is in the directory we are currently in
  if (options.run === 'fix' || options.run === 'update') {
    if (!fs.existsSync('package.json')) {
      throw new Error('Needs to be run within directory that has package.json.')
    }
  } else if (options.run === 'start' && options.sameFolder === true) {
    if (fs.existsSync('package.json')) {
      const {continueAnyway} = await inquirer.prompt([{
        name: 'continueAnyway',
        message: 'package.json exists already in directory. Continue?',
        default: false,
        type: 'confirm'
      }])

      if (continueAnyway === false) {
        process.exit()
      }
    }
  }

  return {sameFolder: options.sameFolder, run: options.run}
}