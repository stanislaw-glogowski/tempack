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
* `-c`, `--config-path [file]` - config file path (default: `tempack.json`)
* `-p`, `--package-path [file]` - package file path (default: `package.json`)
* `-s`, `--silent` - turn on silent mode
* `--disable-colors` - turn off colors
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
    "main": "./index.js"
  },
  "omitPackageKeys": ["private", "devDependencies"],
  "copyFiles": ["README.md"]
}
```

via `package.json`:

```json
{
  "name": "example",
  "version": "0.0.0",
  "private": true,
  "description": "Example Package",
  "devDependencies": {
    "lib": "0.0.0"
  },
  "tempack": {
    "mergePackageWith": {
       "version": "1.0.0",
       "main": "./index.js"
    },
    "omitPackageKeys": ["private", "devDependencies"],
    "copyFiles": ["README.md", "LICENSE.md"]
  }
}
```

The above example will copy `README.md` and `LICENSE.md` files into `./dist` dir and build `./dist/package.json`:

```json
{
  "name": "example",
  "description": "Example Package",
  "version": "0.0.1",
  "main": "./index.js"
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