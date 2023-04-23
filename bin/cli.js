#!/usr/bin/env node

import { copyFileSync } from "fs";
import inquirer from "inquirer";
import { mkdirpSync } from "mkdirp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONTRACT_DIR = join(__dirname, "..", "contracts");

const askContract = async () => {
  const answers = await inquirer.prompt({
    name: "contract",
    type: "list",
    prefix: "◈ ",
    message: "\x1b[32mChoose a contract:\x1b[0m",
    choices: [" Storage", " Certificate", " NFT"],
  });
  return answers.contract;
};

const askLanguage = async () => {
  const answers = await inquirer.prompt({
    name: "language",
    type: "list",
    prefix: "◈ ",
    message: "\x1b[32mChoose a language:\x1b[0m",
    choices: [" Solidity", " Vyper"],
  });
  return answers.language;
};

const touchContract = async () => {
  const contract = await askContract();

  try {
    mkdirpSync("./contracts");
    switch (contract) {
      case " Certificate":
        const clang = await askLanguage();
        switch (clang) {
          case " Vyper":
            copyFileSync(
              `${CONTRACT_DIR}/vyper/Cert.vy`,
              `./contracts/Cert.vy`
            );
            console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/Cert.vy`);
            break;

          default:
            copyFileSync(
              `${CONTRACT_DIR}/solidity/Cert.sol`,
              `./contracts/Cert.sol`
            );
            console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/Cert.sol`);
            break;
        }
        break;

      case " NFT":
        copyFileSync(
          `${CONTRACT_DIR}/solidity/Address.sol`,
          `./contracts/Address.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/Address.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/ERC165.sol`,
          `./contracts/ERC165.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/ERC165.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/ERC721.sol`,
          `./contracts/ERC721.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/ERC721.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/IERC165.sol`,
          `./contracts/IERC165.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/IERC165.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/IERC721.sol`,
          `./contracts/IERC721.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/IERC721.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/IERC721Metadata.sol`,
          `./contracts/IERC721Metadata.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/IERC721Metadata.sol`);
        copyFileSync(
          `${CONTRACT_DIR}/solidity/IERC721Receiver.sol`,
          `./contracts/IERC721Receiver.sol`
        );
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/IERC721Receiver.sol`);
        copyFileSync(`${CONTRACT_DIR}/solidity/NFT.sol`, `./contracts/NFT.sol`);
        console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/NFT.sol`);
        break;

      default:
        const slang = await askLanguage();
        switch (slang) {
          case " Vyper":
            copyFileSync(
              `${CONTRACT_DIR}/vyper/Storage.vy`,
              `./contracts/Storage.vy`
            );
            console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/Storage.vy`);
            break;

          default:
            copyFileSync(
              `${CONTRACT_DIR}/solidity/Storage.sol`,
              `./contracts/Storage.sol`
            );
            console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/Storage.sol`);
            break;
        }
        break;
    }
  } catch (error) {
    console.log(`\x1b[31mFAIL\x1b[0m : ${error}`);
  }
};

touchContract();
