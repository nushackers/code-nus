# Code @ NUS

This is the source code for [http://code.nushackers.org](http://code.nushackers.org). It pulls repo information from [https://github.com/nushackers/code-nus-repos](https://github.com/nushackers/code-nus-repos).

# Getting started

First, install [node.js](http://nodejs.org). Then install `bower` and `gulp`

```bash
$ npm install -g bower gulp
```

Then, install the local dependencies

```bash
$ bower install
$ npm install
```

Then install ruby and scss.

Then set up the data files. To do so, you can copy `app/scripts/data.json.example` to `app/scripts/data.json`, or obtain the most up-to-date data file from [https://github.com/nushackers/code-nus-repos](https://github.com/nushackers/code-nus-repos).

Finally start developing with

```bash
$ gulp watch
```

