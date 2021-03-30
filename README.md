# Name Check

![build status](https://github.com/wemakezone/docs/actions/workflows/firebase-hosting-merge.yml/badge.svg)

## Dependencies

[node 14](https://nodejs.org/en/), [yarn](https://yarnpkg.com/), and
[firebase-tools](https://www.npmjs.com/package/firebase-tools)

## Installation

From the root folder:

`yarn install`

## Development

From the root folder, run the following 3 commands in different terminals:

Launch frontend:

`yarn start:frontend`

Build functions and watch for changes:

`build:functions --watch`

Launch functions emulator:

`yarn start:functions`

Once started, you can find the frontend at
[http://localhost:3000/](http://localhost:3000/), and you can check the
functions emulator dashboard at
[http://localhost:5002/](http://localhost:5002/).
