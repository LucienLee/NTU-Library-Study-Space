# NTU Library Study Space

[![Standard - JavaScript Style
Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> initialized with vue-cli v2.4.0 with `vue init webpack`

## Build Setup

#### install dependencies
``` bash
npm install
```

### run for development

First, you need a mongodb running.

```
mongod
```

if you get error about permission denied, you can either run it with `sudo`:
```
sudo mongod
```

or you can change the ownership of the default db path (`/data/db`) to yourself:
```
sudo chown -R `whoami` /data/db
```

now you can run the dev server:
```
# serve with hot reload at localhost:8080
# and graphQL server at localhost:3000/graphql
npm start
```

### build for production
```
# build for production with minification
npm run build
```

### run tests
```
# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Directory Structure

```
.
├── build/                           # Build scripts and webpack config files
├── config/                          # Project configures
├── desktop/                         # Electron files
├── dist/                            # Packed files (prepared to deploy to server)
├── docs/                            # Documentation files
├── release/                         # Bundled desktop app files
├── src/                             # Source files
│   ├── assets/                      # Module assets
│   ├── components/                  # Vue UI components
│   ├── sass/                        # Global style files
│   ├── store/                       # Vuex stores
│   ├── util/                        # Global utilities
│   ├── App.vue                      # Main app component
│   ├── main-library-desktop.js      # Main entry for desktop app
│   ├── main-external-client.js      # Main entry for client out of library
│   └── seat-config.json             # Seats properties on the map
├── server/                          # Server related files
├── seatConfigGenerator/             # Seats properties generator
├── static/                          # Static assets (without processing by webpack)
├── test/                            # Automated tests (under constructed)
├── index.html                       # index.html template
└── README.md
```

## Built With

* [Vue](https://vuejs.org/) - The web framework proudly used
* [Vuex](https://github.com/vuejs/vuex) - Manage client-side state
* [D3](https://d3js.org) - Handle svg map interaction
* [GSAP](https://github.com/greensock/GreenSock-JS) - Smooth JS-based Animation
* [Apollo](http://dev.apollodata.com/) - Access server data with GraphQL
* [Electron](http://electron.atom.io/) - Build cross platform desktop apps

## Documents

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Entry point

In `src/`, there are two entry points, namely `main-library-desktop.js` and
`main-external-client.js`, these are the entry points for the **Electron Desktop
App** for the library and the **Website for external users**.

This is done by using the [code
spilting](https://webpack.github.io/docs/code-splitting.html) feature of webpack.

Differences are things such as fonts are loaded via CDN or included, or some
functions are only included each version.

Currently we are only serving the `libraryDesktop` part

## License
