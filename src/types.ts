
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

export interface GeneratePackageJsonInput {
  node?: string
  type: string
  vite?: string
}

export interface GeneratePackageJsonInputWithOptions extends GeneratePackageJsonInput {
  node?: string
  options: {
    port?: string
  }
  type: string
  vite?: string
}
