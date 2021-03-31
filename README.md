# Name Check

![build status](https://github.com/wemakezone/namecheck.dev/actions/workflows/firebase-hosting-merge.yml/badge.svg)

## Dependencies

- [node 14](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)
- [firebase-tools](https://www.npmjs.com/package/firebase-tools)

Note: `firebase-tools` should be installed globally using yarn:

```
yarn global add firebase-tools
```

## Installation

From the root folder:

```
yarn install
```

## Development

From the root folder, run the following 3 commands in different terminals:

1. Build functions and watch for changes:

```
yarn build:functions --watch
```

2. Launch functions emulator:

```
yarn start:functions
```

3. Launch frontend:

```
yarn start:frontend
```

Once started, you can find the frontend at
[http://localhost:3000/](http://localhost:3000/), and you can check the
functions emulator dashboard at
[http://localhost:5002/](http://localhost:5002/).
