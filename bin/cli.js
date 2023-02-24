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
    choices: [" Storage", " Cert", " NFT"],
  });
  return answers.contract;
};

const touchContract = async () => {
  const contract_ = await askContract();
  const contract = contract_.slice(1);
  try {
    mkdirpSync("./contracts");
    copyFileSync(`${CONTRACT_DIR}/${contract}.sol`, `./contracts/${contract}.sol`);
    console.log(`\x1b[36mCREATE\x1b[0m : ./contracts/${contract}.sol`);
  } catch (error) {
    console.log(`\x1b[31mFAIL\x1b[0m : ${error}`);
  }
};

touchContract();
