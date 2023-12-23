#!/usr/bin/env node

// start of imports
import inquirer from 'inquirer';
import askNpmName from 'inquirer-npm-name';
import yargs from "yargs";
import {hideBin} from "yargs/helpers";

/**
 * @since 1.0.0
 */
async function parseOptions(): Promise<any> {
  const inputOptions = await yargs(hideBin(process.argv))
    .parseAsync();

  console.log(inputOptions)

  return inputOptions

}

/**
 * @since 1.0.0
 * @param defaultProjectName
 */
const getProjectName = async (defaultProjectName: string) => {
  const { npmName } = await askNpmName(
    {
      name: 'npmName',
      message: 'Your project npm name',
      default: defaultProjectName,
    },
    inquirer
  );

  return npmName;
};

/**
 * @since 1.0.0
 */
const main = async () => {
  const options = await parseOptions();

  await getProjectName('project-app-setup')

  console.log(options)

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});