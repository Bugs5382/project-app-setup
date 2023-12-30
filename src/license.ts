import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyTemplateFile } from './template.js'

const dirName = path.dirname(fileURLToPath(import.meta.url))

interface LicenseProps {
  name: string
  email: string
  license: string
  website?: string
}

export const licenseChoices = [
  { name: 'Apache 2.0', value: 'Apache-2.0' },
  { name: 'MIT', value: 'MIT' },
  { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
  { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
  { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
  { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
  { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
  { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
  { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
  { name: 'No License (Copyrighted)', value: 'UNLICENSED' },
  { name: 'Unlicense', value: 'Unlicense' }
]

/**
 * Generate Licence
 * @since 1.3.0
 * @param props
 */
export const generateLicense = async (props: LicenseProps): Promise<void> => {
  const filename = `${props.license}.txt`
  let author = props.name.trim()

  if (typeof props.email !== 'undefined' && props.email !== "") {
    author += ' <' + props.email.trim() + '>'
  }

  if (typeof props.website !== 'undefined' && props.website !== "") {
    author += ' (' + props.website.trim() + ')'
  }

  await copyTemplateFile(
    filename,
    path.join(dirName, '..', 'template', 'license'),
    process.cwd(),
    {
      rename: { [filename]: 'LICENSE' },
      replace: [
        { replaceString: '<%- year %>', var: new Date().getFullYear().toString() },
        { replaceString: '<%- author %>', var: author }
      ]
    }
  )
}
