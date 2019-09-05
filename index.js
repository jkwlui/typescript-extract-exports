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
