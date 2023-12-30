export const DEFAULT_NPM = {
  author: {
    name: 'Shane Froebel'
    // url: 'https://therabbithole.com/' // website is not online yet...
  }
}

export const CLI_PROGRESS = (area: string) =>  {
  return {
    format: `${area} {bar}\u25A0 {percentage}% | ETA: {eta}s | {value}/{total}`,
    barCompleteChar: '\u25A0',
    barIncompleteChar: ' '
  }
};