# NTU Library Study Space

> initialized with vue-cli v2.4.0 with `vue init webpack`

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Entry point

In `src/`, there are two entry points, namely `main-library-desktop.js` and
`main-external-client.js`, these are the entry points for the **Electron Desktop
App** for the library and the **Website for external users**.

This is done by using the [code spilting] feature of webpack.

Differences are things such as fonts are loaded via CDN or included, or some
functions are only included each version.

Currently we are only doing serving the libraryDesktop part

