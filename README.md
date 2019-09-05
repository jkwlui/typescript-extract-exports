# typescript-extract-export

### Why?

You might have hundreds or thousand of types across many files you need to export as part of the package, this tool outputs all your types/interfaces/classes so it's copy-pastable into your `index.ts`.

### Usage

```shell
  $  npm install
  $  node index.js <.ts file>
```

The program outputs a list of comma-delimited (exported) types from the file into stdout, which you can then copy and paste into your main file.

### Improvements

 - Support glob patterns for parsing multiple files at once
 - ... file a feature request
