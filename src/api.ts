import { TemplateCopyOptions, Replacement, GenerateInput, Dependencies, LicenseProps, GeneratePackageJsonInputWithOptions, GeneratePackageJsonParams } from './declaration/types.js'

import { main } from './index.js'
import { copyTemplateFile } from './helpers/copyTemplateFile.js'
import { copyTemplateFiles } from './helpers/copyTemplateFiles.js'
import { getOccurrence } from './helpers/getOccurrence.js'
import { getProjectName } from './helpers/getProjectName.js'
import { installDeps } from './helpers/installDeps.js'
import { recurseDir } from './helpers/recurseDir.js'
import {
  cliProgressFunc, DEFAULT_NPM, dirName, EMPTY_PROJECT, FASTIFY_GRAPHQL_CONTROLLER,
  FASTIFY_GRAPHQL_MICROSERVICES, FASTIFY_NPM_PACKAGE, isProd, NPM_PACKAGE, SHARED_DEV,
  VITE_REACT_SWC
} from './modules/constants.js'

import { returnDependencies } from './modules/dependencies.js'
import { addRemoteGitHub, addRemotePrivate, init } from './modules/git.js'
import { generateLicense, licenseChoices } from './modules/license.js'
import { generatePackageJson } from './modules/npm.js'

export { copyTemplateFile, copyTemplateFiles, getOccurrence, getProjectName, installDeps, main, recurseDir }
export { dirName, DEFAULT_NPM, cliProgressFunc, EMPTY_PROJECT, SHARED_DEV, FASTIFY_GRAPHQL_CONTROLLER, FASTIFY_GRAPHQL_MICROSERVICES, FASTIFY_NPM_PACKAGE, NPM_PACKAGE, VITE_REACT_SWC, isProd, returnDependencies, init, addRemoteGitHub, addRemotePrivate }
export { licenseChoices, generateLicense }
export { generatePackageJson }

export { TemplateCopyOptions, Replacement, GenerateInput, Dependencies, LicenseProps, GeneratePackageJsonInputWithOptions, GeneratePackageJsonParams }
