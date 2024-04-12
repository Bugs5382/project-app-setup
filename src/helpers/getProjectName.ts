import inquirer from 'inquirer'
import askNpmName from 'inquirer-npm-name'

/**
 * @since 1.0.0
 * @param defaultProjectName
 */
export const getProjectName = async (defaultProjectName: string): Promise<string> => {
  const { npmName } = await askNpmName(
    {
      default: defaultProjectName,
      name: 'npmName',
      message: 'Your Project NPM name?',
      type: 'input'
    },
    inquirer
  )

  return npmName
}
