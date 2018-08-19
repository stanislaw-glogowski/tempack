# tempack

[![NPM version][npm-image]][npm-url]

Small util which treats `package.json` as a distribution template.

## Installation

```bash
$ npm i tempack -g
```

### Usage
```bash
$ tempack [options] <dist>

Options:
  <dist> - distribution directory path

  -v, --version              output the version number
  -c, --config-path [file]   custom tempack.json file path
  -p, --package-path [file]  custom package.json file path
  -h, --help                 output usage information
```

## Configuration Example

`tempack.json` example:

```json
{
  "mergePackageWith": {
    "version": "1.0.0",
    "main": "./dist/index.js"
  },
  "omitPackageKeys": ["private", "devDependencies"],
  "copyFiles": ["README.md"]
}
```

`package.json` example:

```json
{
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "example": "0.0.1"
  },  
  "tempack": {
    "mergePackageWith": {
       "version": "1.0.0",
       "main": "./dist/index.js"
    },
    "omitPackageKeys": ["private", "devDependencies"],
    "copyFiles": ["README.md", "INFO.md"]
  }
}
```

`package.json` output:

```json
{
  "version": "0.0.1",
  "main": "./dist/index.js"
}
```

## License

The MIT License

[npm-image]: https://badge.fury.io/js/tempack.svg
[npm-url]: https://npmjs.org/package/tempack