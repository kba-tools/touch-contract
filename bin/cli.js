#!/usr/bin/env node

import { copyFileSync, existsSync } from 'fs'
import inquirer from 'inquirer'
import { mkdirpSync } from 'mkdirp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CONTRACT_DIR = join(__dirname, '..', 'contracts')
const OUTPUT_DIR = './contracts'

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
}

const log = {
  create: (path) =>
    console.log(`${colors.cyan}CREATE${colors.reset} : ${path}`),
  error: (msg) => console.log(`${colors.red}ERROR${colors.reset} : ${msg}`),
  warning: (msg) =>
    console.log(`${colors.yellow}WARNING${colors.reset} : ${msg}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
}

const contracts = {
  Storage: {
    languages: ['Solidity', 'Vyper'],
    files: {
      Solidity: [{ src: 'solidity/Storage.sol', dest: 'Storage.sol' }],
      Vyper: [{ src: 'vyper/Storage.vy', dest: 'Storage.vy' }],
    },
  },
  Certificate: {
    languages: ['Solidity', 'Vyper'],
    files: {
      Solidity: [{ src: 'solidity/Cert.sol', dest: 'Cert.sol' }],
      Vyper: [{ src: 'vyper/Cert.vy', dest: 'Cert.vy' }],
    },
  },
  Auction: {
    languages: ['Vyper'],
    files: {
      Vyper: [{ src: 'vyper/Auction.vy', dest: 'Auction.vy' }],
    },
  },
  NFT: {
    languages: ['Solidity'],
    files: {
      Solidity: [
        { src: 'solidity/NFT/Address.sol', dest: 'Address.sol' },
        { src: 'solidity/NFT/ERC165.sol', dest: 'ERC165.sol' },
        { src: 'solidity/NFT/ERC721.sol', dest: 'ERC721.sol' },
        { src: 'solidity/NFT/ERC721Utils.sol', dest: 'ERC721Utils.sol' },
        { src: 'solidity/NFT/Errors.sol', dest: 'Errors.sol' },
        { src: 'solidity/NFT/IERC165.sol', dest: 'IERC165.sol' },
        { src: 'solidity/NFT/IERC721.sol', dest: 'IERC721.sol' },
        { src: 'solidity/NFT/IERC721Errors.sol', dest: 'IERC721Errors.sol' },
        {
          src: 'solidity/NFT/IERC721Metadata.sol',
          dest: 'IERC721Metadata.sol',
        },
        {
          src: 'solidity/NFT/IERC721Receiver.sol',
          dest: 'IERC721Receiver.sol',
        },
        { src: 'solidity/NFT/LowLevelCall.sol', dest: 'LowLevelCall.sol' },
        { src: 'solidity/NFT/NFT.sol', dest: 'NFT.sol' },
      ],
    },
  },
  Voting: {
    languages: ['Vyper'],
    files: {
      Vyper: [{ src: 'vyper/Voting.vy', dest: 'Voting.vy' }],
    },
  },
}

const askContract = async () => {
  const { contract } = await inquirer.prompt({
    name: 'contract',
    type: 'list',
    prefix: '◈',
    message: `${colors.green}Choose a contract:${colors.reset}`,
    choices: Object.keys(contracts),
  })
  return contract
}

const askLanguage = async (availableLanguages) => {
  if (availableLanguages.length === 1) {
    return availableLanguages[0]
  }

  const { language } = await inquirer.prompt({
    name: 'language',
    type: 'list',
    prefix: '◈',
    message: `${colors.green}Choose a language:${colors.reset}`,
    choices: availableLanguages,
  })
  return language
}

const copyContracts = (files) => {
  const copied = []
  const failed = []

  for (const file of files) {
    const srcPath = join(CONTRACT_DIR, file.src)
    const destPath = join(OUTPUT_DIR, file.dest)

    try {
      if (!existsSync(srcPath)) {
        throw new Error(`Source file not found: ${srcPath}`)
      }

      copyFileSync(srcPath, destPath)
      log.create(destPath)
      copied.push(file.dest)
    } catch (error) {
      log.error(`Failed to copy ${file.dest}: ${error.message}`)
      failed.push(file.dest)
    }
  }

  return { copied, failed }
}

const main = async () => {
  try {
    console.log('')

    const contractType = await askContract()
    const config = contracts[contractType]
    const language = await askLanguage(config.languages)
    const files = config.files[language]

    // Ensure output directory exists
    mkdirpSync(OUTPUT_DIR)

    console.log('')
    const { copied, failed } = copyContracts(files)

    console.log('')
    if (failed.length === 0) {
      log.success(`✓ Successfully created ${copied.length} contract file(s)`)
    } else {
      log.warning(`⚠ Created ${copied.length} file(s), ${failed.length} failed`)
      process.exit(1)
    }
  } catch (error) {
    console.log('')
    log.error(error.message || 'An unexpected error occurred')
    process.exit(1)
  }
}

main()
