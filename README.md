# Tempack

[![NPM version][npm-image]][npm-url]

Small util which treats `package.json` as a distribution template.

## Installation

```bash
$ npm i tempack -g
```

## Usage
```bash
$ tempack [options] <dist>
```

`<dist>` - distribution directory path, used `process.cwd()` as default

**Options:**

* `-v`, `--version` - output the version number
* `-c`, `--config-path [file]` - custom tempack.json file path
* `-p`, `--package-path [file]` - custom package.json file path
* `-h`, `--help` - output usage information

## Configuration 

| Field 	| Default Value 	| Description 	|
|--------------------	|:-------------:	|-------------------------------------------------	|
| `mergePackageWith` 	| `{}` 	| Additional destination package fields 	|
| `omitPackageKeys` 	| `[]` 	| Keys from source package that should be omitted 	|
| `copyFiles` 	| `[]` 	| List of files that should be copied 	|

via `tempack.json`:

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

via `package.json`:

```json
{
  "tempack": {
    "mergePackageWith": {
       "version": "1.0.0",
       "main": "./dist/index.js"
    },
    "omitPackageKeys": ["private", "devDependencies"],
    "copyFiles": ["README.md"]
  }
}
```

example `package.json` output:

```json
{
  "version": "0.0.1",
  "main": "./dist/index.js"
}
```

## Testing

```bash
$ npm test
```

## License

The MIT License

[npm-image]: https://badge.fury.io/js/tempack.svg
[npm-url]: https://npmjs.org/package/tempack