# ES6 modules in modern browsers showcase

The goal of this demo is to showcase the usage of ES6 modules in the browser in 3 different configurations :

- unbundled ES6 modules
- bundled ES6 modules
- legacy ES6 modules transpiled to ES5

The demo application is a full ES6 version of TodoMVC :

- created by [Oscar Godson](http://twitter.com/oscargodson)
- refactored by [Christoph Burgmer](http://twitter.com/cburgmer)
- ported to ES6 by [Kent C. Dodds](http://twitter.com/kentcdodds)
- web-ified by [Paul Irish](http://twitter.com/paul_irish)

## Setup

```
npm i
```

## Sources

main.js and main-unbudled.js are the only two main entry point.

The only difference between them is the import of babel-polyfill inside main.js

## Usage of external library from npm

An example of usage of lodash has been added, to demonstrate the import with relative path and support during build and develop.

## Usage of external ComonJS library from npm

An example of leftpad in CommonJS syntax is used inside support.js

This file if converted in plain CommonJS with npm script "support-cjs".

The last task to generate a compatible ES6 support module for your ES6 application is to used npm script "cjs-to-es6". It will generate a ES6 compatible module for support-cjs.js file

## Start

```
npm start
```

## Discover

The demo is hosted on Firebase, with HTTP/2 enabled by default by Firebase

### Legacy version

URL : https://es6-modules-in-browsers.firebaseapp.com/index-legacy.html

Webpagetest : https://www.webpagetest.org/result/170920_3C_c92ff8e332a48d3245435e1ad24ba9df/

### Bundled version

URL : https://es6-modules-in-browsers.firebaseapp.com/ for bundled version

Webpagetest : https://www.webpagetest.org/result/170920_4F_4d4b2a52fe3ce9355b6998dbe4de57f2/

### Unbundled version

URL : https://es6-modules-in-browsers.firebaseapp.com/index-unbundled.html

Webpagetest : https://www.webpagetest.org/result/170920_S3_0ecd11c04a1b30a9644211cc500b4bdb/
