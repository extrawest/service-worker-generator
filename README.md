![Maintaner](https://img.shields.io/badge/maintainer-extrawest.com-blue)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/extrawest/service-worker-generator/graphs/commit-activity)
![GitHub release](https://img.shields.io/github/v/release/extrawest/service-worker-generator)
[![GitHub tag](https://img.shields.io/github/v/tag/extrawest/service-worker-generator)](https://github.com/extrawest/service-worker-generator/tags/)
# Extrawest Service Worker Generator

Utility tool to allow generate service-worker with env variables

## Installation

Extrawest Service Worker Generator compatible with webpack5

```bash
# with npm
npm install --save @extrawest/service-worker-generator

# with yarn
yarn add @extrawest/service-worker-generator
```
## Usage

$ generateSW [options] `<file>`

## Options

| Command | Description |
| ----------------- |---------------------------------------------|
| -e, --env [path]  | (./.env) Path to environment variables file |
|-d, --build-path [path] | path of build artifacts [./build]      |
| -h, --help        |      Output usage information               |
| -m, --mode [mode] |      Output mode (dev or build)                        |

## License

- See [LICENSE](/LICENSE)

---
Created by Extrawest React.js Team
[Extrawest.com](https://www.extrawest.com), 2021
---