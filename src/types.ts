
export interface Dependencies {
  dependencies: string[]
  devDependencies: string[]
}

export interface GeneratePackageJsonParams {
  name: string
  description: string
  keywords?: string[]
  author: {
    name: string
    email?: string
    url?: string
  }
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

export interface TemplateCopyOptions {
  rename?: { [filename: string]: string }
}