#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { mkdirp } from 'mkdirp';

const contract = '// SPDX-License-Identifier: MIT\npragma solidity 0.8.17;\n\ncontract Cert {\n    address admin;\n\n    constructor() {\n        admin = msg.sender;\n    }\n\n    modifier onlyAdmin() {\n        require(msg.sender == admin, "Access Denied");\n        _;\n    }\n\n    struct Certificate {\n        string course;\n        string name;\n        string grade;\n        string date;\n    }\n\n    mapping(string => Certificate) public Certificates;\n\n    function issue(\n        string memory _id,\n        string memory _course,\n        string memory _name,\n        string memory _grade,\n        string memory _date\n    ) public onlyAdmin {\n        Certificates[_id] = Certificate(_course, _name, _grade, _date);\n    }\n}\n';

const touchContract = async () => {
    try {
        await mkdirp('./contracts');
        writeFileSync("./contracts/Cert.sol", contract);
    } catch (error) {
        console.log(`\x1b[31mFAIL\x1b[0m : ${error}`);
    }
}

touchContract();

console.log('\x1b[36mCREATE\x1b[0m : ./contracts/Cert.sol');
