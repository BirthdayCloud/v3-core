import {readdirSync, readFileSync, statSync, writeFileSync} from 'fs'
import {resolve, join} from 'path'

const SOLIDITY_COMPILER_VERSION = "=0.7.6"
const CONTRACTS_PATH = resolve('./contracts')
let filesFormatted = 0;

walk(CONTRACTS_PATH, formatFile)
console.log(`Format completed. Files formatted: ${filesFormatted}`)

// Recursively apply a function to every file.
function walk(dirPath: string, cb: (filePath: string, solidityVersion: string) => void) {
  for (const entry of readdirSync(dirPath)) {
    const qualifiedPath = join(dirPath, entry)
    const metadata = statSync(qualifiedPath)

    if (metadata.isFile()) {
      cb(qualifiedPath, SOLIDITY_COMPILER_VERSION)
    }

    if (metadata.isDirectory()) {
      walk(qualifiedPath, cb)
    }
  }
}

function formatFile(filePath: string, solidityVersion: string) {
  const fileContents = readFileSync(filePath, {encoding: 'utf-8'})
  const fileLines = fileContents.split('\n')
  const fileLinesCopy = [...fileLines]

  for (let i = 0; i < fileLines.length; i++) {
    const line = fileLines[i]
    // If the line starts with `pragma solidity` but does not end with the version that we want,
    // we need to overwrite the version.
    if (line.startsWith('pragma solidity') && !line.endsWith(`${solidityVersion};`)) {
      fileLinesCopy[i] = `pragma solidity ${solidityVersion};`

      const newFile = fileLinesCopy.join('\n')
      writeFileSync(filePath, newFile, 'utf-8')
      filesFormatted++
    }
  }
}
