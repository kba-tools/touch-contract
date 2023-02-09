#!/usr/bin/env node

import { execSync } from 'child_process';

const runOp = op => {
    try {
        execSync(`${op}`, { stdio: 'inherit' });
    } catch (error) {
        console.log(`\x1b[31mFAIL\x1b[0m : ${op}`);
        return false;
    }
    return true;
}

const dir_op = 'mkdir -p contracts';

const dir_res = runOp(dir_op);
if (!dir_res) process.exit(1);

const rmf_op = 'cd contracts/ && rm -f Cert.sol';

const rmf_res = runOp(rmf_op);
if (!rmf_res) process.exit(1);

const cat_op = 'cat << EOF >> ./contracts/Cert.sol \n// SPDX-License-Identifier: MIT\npragma solidity 0.8.17;\n\ncontract Cert {\n    address admin;\n\n    constructor() {\n        admin = msg.sender;\n    }\n\n    modifier onlyAdmin() {\n        require(msg.sender == admin, "Access Denied");\n        _;\n    }\n\n    struct Certificate {\n        string course;\n        string name;\n        string grade;\n        string date;\n    }\n\n    mapping(string => Certificate) public Certificates;\n\n    function issue(\n        string memory _id,\n        string memory _course,\n        string memory _name,\n        string memory _grade,\n        string memory _date\n    ) public onlyAdmin {\n        Certificates[_id] = Certificate(_course, _name, _grade, _date);\n    }\n}\nEOF';

const cat_res = runOp(cat_op);
if (!cat_res) process.exit(1);

console.log('\x1b[36mCREATE\x1b[0m : ./contracts/Cert.sol');
