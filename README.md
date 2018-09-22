# Muilessium UI Framework
![version-badge](https://img.shields.io/npm/v/muilessium.svg?style=flat-square&colorB=00b5d6) ![npm-downloads](https://img.shields.io/npm/dt/muilessium.svg?style=flat-square&colorB=00b5d6) ![license-badge](https://img.shields.io/badge/dynamic/json.svg?style=flat-square&label=license&colorB=00b5d6&prefix=&suffix=&query=license&uri=https://raw.githubusercontent.com/sfi0zy/muilessium/master/package.json)

## Description
Muilessium is a UI framework for simple static websites (personal blogs, landings e.t.c.). It consists of over 50 components, a lot of utilities, helpers and syntax wrappers to make your code cleaner. This project can be used as a dependency or you can fork it and use as boilerplate for your project.

![Preview](https://sfi0zy.github.io/images/456b9f3f6080a9056a34ce74872af98a.jpg)


## Docs
[https://sfi0zy.github.io/muilessium](https://sfi0zy.github.io/muilessium)

## NPM
```sh
npm install muilessium
```

To use Muilessium you should include two files into the bottom of your page:

```
node_modules/muilessium/dist/css/muilessium.min.css
node_modules/muilessium/dist/js/muilessium.min.js
```

## Development
```sh
git clone https://github.com/sfi0zy/muilessium.git
cd muilessium
npm i
npm run dev
```
### Build for production:
```sh
npm run prod
```

### Changelog (since v0.2):
#### Added:
 - Improved development environment (dev/prod builds, sourcemaps, eslint, unit tests for utilities)
 - Default SVG icons
 - Simple global store
 - Scroll to the default anchor
 - Styles for printing
 - New colorful docs - all components and utilities on one page
 - New utilities - deepGet, deepSet, toLispCase, upperLimit, lowerLimit
 - New components - CustomScroll, Notification
#### Changed:
 - Structure of the global Muilessium object including names of the fields
 - Color scheme including names of the colors
 - Markup for the custom-scroll, header-navigation, hero-header, input, modal-window
#### Removed:
 - Old grid based on floats
 - Warnings in the ifExists and ifNodeList utilities
#### Fixed:
 - Keyboard controls, infinite focus loops
 - Logical errors in utilities
 - IE11 support
 - Different CSS bugs
 - Vulnerabilities in dependencies

## Contribution
I don't have enough time to work on this project and I'll be glad to see new developers here. If you are a beginner front-end developer and you want to boost your CV or you have your own ideas of how to improve the project - take a look on [issues page](https://github.com/sfi0zy/muilessium/issues).

## License
MIT License

Copyright (c) 2016-2018 Ivan Bogachev <sfi0zy@gmail.com>

