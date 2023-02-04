import shell from '../../../logic/shell'
import messages from '../../../logic/console-messages'
import fileSystem from '../../../logic/file-system'
import { addStaticTemplates } from '../../../logic/template-manager'


const createFolders = async (root: string): Promise<void> => {
  try {
    await fileSystem.makeDirectory(root)
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'createFolders')
  }
}

export const initializeDms = async (): Promise<void> => {
  try {
    const root = `${process.cwd()}`
    const dmsRoot = `${root}/DMS`
    const sniffNpm = `${root}/package-lock.json`
    const sourceFolder = fileSystem.getSourceFolder(__dirname)

    // messages.info(`root: ${root}`)
    // messages.info(`dmsRoot: ${dmsRoot}`)
    // messages.info(`sniffNpm: ${sniffNpm}`)

    if (fileSystem.exists(sniffNpm)) {
      // messages.info('using npm')
      messages.info('')
      messages.info('Please wait while we npm install "react-query"...')
      messages.info('')

      await shell.executeAsync(`npm i react-query`)
    } else {
      messages.info('')
      messages.info('Please wait while we yarn add "react-query"...')
      messages.info('')

      await shell.executeAsync(`yarn add react-query`)
    }

    await createFolders(dmsRoot)
    await addStaticTemplates(sourceFolder, dmsRoot)
    messages.info('The end')
  } catch (e) {
    //@ts-ignore
    messages.handleError(e, 'createNodeApi')
  }
}
