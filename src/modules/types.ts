
export interface Dependencies {
  dependencies: string[]
  devDependencies: string[]
}

export interface GeneratePackageJsonParams {
  name: string
  description: string
  license: string
  keywords?: string[]
  author: {
    name: string
    email?: string
    url?: string
  }
  gitIssues?: string
  gitReadme?: string
  gitUrl?: string
}

export interface GenerateInput {
  node?: string
  type: string
  vite?: string
}

export interface GeneratePackageJsonInputWithOptions extends GenerateInput {
  node?: string
  options: {
    port?: string
  }
  type: string
  vite?: string
}

interface Replacement {
  var: string
  replaceString: string
}

export interface TemplateCopyOptions {
  replace?: Replacement[]
  rename?: { [filename: string]: string }
}
