# Code @ NUS

This is the source code for [http://code.nushackers.org](http://code.nushackers.org). It pulls repo information from [https://github.com/nushackers/code-nus-repos](https://github.com/nushackers/code-nus-repos).

# Getting started

First, install [node.js](https://nodejs.org) and [yarn](https://yarnpkg.com)

Then, install the local dependencies

```bash
$ yarn install
```

Copy `.env.example` to `.env` with your very own [Github token](https://github.com/settings/tokens).

Finally start developing with

```bash
$ yarn start
```

## Scraping

```bash
$ yarn scrape
```
