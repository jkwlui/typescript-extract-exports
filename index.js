#!/usr/bin/env node

/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const {TypescriptParser} = require('typescript-parser');
const program = require('commander');

function getExports(results) {
  let expts = [];

  if (results.exports) {
    results.exports.forEach((exp) => {
      expts = expts.concat(
        exp.specifiers.map((spec) => spec.specifier),
      )
    });
  }

  if (results.declarations) {
    results.declarations.forEach((declaration) => {
      if (declaration.isExported) {
        expts.push(declaration.name);
      }
    })
  }

  return expts;
}

async function parseFile(target) {
  const content = fs.readFileSync(target, 'utf-8');

  const parser = new TypescriptParser();
  const parsed = await parser.parseSource(content);

  const exports = getExports(parsed);
  exports.sort();
  return exports.join(',');
}

async function main() {
  let target;

  program
    .arguments('<file>')
    .action((file) => {
      target = file;
    });

  program.parse(process.argv);

  if (!target) {
    console.error('Provide the file argument.');
  }

  return await parseFile(target);
}

main().then(console.log, console.error);
