# tempack

Small util which treats original `package.json` as a distribution template.

## Installation

```bash
$ npm install tempack -g
```

## Configuration

### Via `tempack.json`
```json
{
  "package": {
    "mergeWith": {
      // new `package.json` configuration
    },
    "omit": [
      // configration paths which needs to be omitted
      // in distribution
    ]
  },
  "files": [
    // file / dirs paths which should be copied
    // to distribution
  ]
}
```

### Via `package.json`
```json
{
  "tempack": {
    // tempack.json configration
  }
}
```

### Usage
```bash
$ tempack [options] <dist>
```
`<dist>` - distribution directory path.

Options
* -c, --config-file `[file]` - custom `tempack.json` file path
* -p, --package-file `[file]` - custom `package.json` file path

### Example

Original `package.json`

```json
{
  "name": "tempack",
  "private": true,
  "description": "Distribution util",
  "version": "0.0.1",
  "author": {
    "name": "Stanislaw Glogowski",
    "email": "hello@newobject.pl"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/stanislaw-glogowski/tempack.git"
  },
  "scripts": {
    "prebuild": "rimraf ./dist/*",
    "build": "tsc",
    "postbuild": "tempack ./dist",
    "lint": "tslint --exclude node_modules **/*.ts"
  },
  "dependencies": {
    "commander": "^2.10.0",
    "fs-extra": "^3.0.1",
    "lodash": "^4.17.4"
  },
  "devDependencies": {
    "@types/commander": "^2.9.1",
    "@types/fs-extra": "^3.0.3",
    "@types/lodash": "^4.14.66",
    "@types/node": "^7.0.23",
    "rimraf": "^2.6.1",
    "tslint": "^5.4.2",
    "typescript": "^2.3.4"
  },
  "engines": {
    "node": ">=6.0.0"
  },
  "tempack": {
    "package": {
      "mergeWith": {
        "main": "./dist/index.js",
        "bin": "./dist/index.js"
      },
      "omit": [
        "private",
        "devDependencies",
        "scripts"
      ]
    }
  }
}
```

Build distribution:

```bash
$ npm run build
```

Distribution `./dist/package.json`:

```json
{
  "name": "tempack",
  "description": "Distribution util",
  "version": "0.0.1",
  "author": {
    "name": "Stanislaw Glogowski",
    "email": "hello@newobject.pl"
  },
  "bin": "./dist/index.js",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/stanislaw-glogowski/tempack.git"
  },
  "dependencies": {
    "commander": "^2.10.0",
    "fs-extra": "^3.0.1",
    "lodash": "^4.17.4"
  },
  "engines": {
    "node": ">=6.0.0"
  },
  "main": "./dist/index.js",
  "bin": "./dist/index.js"

}
```

## License

The MIT License