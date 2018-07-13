# lingui-string-validation
<p>
  <a href="https://badge.fury.io/js/lingui-string-validation">
    <img
      alt="npm version"
      src="https://badge.fury.io/js/lingui-string-validation.svg"
    />
  </a>
  <a href="https://coveralls.io/github/purepennons/lingui-string-validation?branch=master">
    <img src="https://coveralls.io/repos/github/purepennons/lingui-string-validation/badge.svg" alt="Coverage Status" />
  </a>
  <a href="https://github.com/purepennons/lingui-string-validation/blob/master/LICENSE">
    <img
      alt="license mit"
      src="https://img.shields.io/badge/License-MIT-blue.svg"
    />
  </a>
  <a href="https://circleci.com/gh/purepennons/lingui-string-validation/tree/master">
    <img
      alt="circle ci"
      src="https://circleci.com/gh/purepennons/lingui-string-validation/tree/master.svg?style=svg"
    />
  </a>
</p>


[![Coverage Status](https://coveralls.io/repos/github/purepennons/lingui-string-validation/badge.svg)](https://coveralls.io/github/purepennons/lingui-string-validation)

Check a string is a valid [jsLingui](https://github.com/lingui/js-lingui) string or not (compare with jsLingui [minimal](https://lingui.github.io/js-lingui/ref/lingui-conf.html#minimal) format key).

## Dependencies
- lodash
  - Sorry for that, it will be removed in next version

## Usage
- Install
```shell
yarn add lodash lingui-string-validation
```

- Usage
```js
  /**
   * -1: bad key
   * 0: bad text
   * 1: valid text
   * 2: empty text
   */

import checkI18nString from 'lingui-string-validation'
// const lingui-string-validation = require('lingui-string-validation').default

const linguiKey = '<0>This is a text with <1>{variable}</1><2>visit counts: {0}</2></0>'
const badKey = 'This is a bad {key'

checkI18nString(badKey, '<0>This is a text with <1>{variable}</1><2>visit counts: {0}</2></0>') // -1
checkI18nString(linguiKey, '<0>This is a text with <1>{variable}</1><2>visit counts: {0}</2></0>') // 1
checkI18nString(linguiKey, '<0><2>觀看次數：{0}</2>, 這是一段有<1>變數</1>的文字</0>') // 1
checkI18nString(linguiKey, '<0>This is a text with <1>{variable}<1><2>visit counts: {0}</2></0>') // 0
checkI18nString(linguiKey, '<0>This is a text with <3>{variable}</3><2>visit counts: {0}</2></0>') // 0
checkI18nString(linguiKey, '<0>This is a text with <1>{different}</1><2>visit counts: {0}</2></0>') // 0
checkI18nString(linguiKey, '<0>This is a text with <1>{variable}</1><2>visit counts: 0}</2></0>') // 0
checkI18nString(linguiKey, '') // 2
```

