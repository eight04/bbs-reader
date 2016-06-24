BBS Reader
==========

A simple service that translate ansi colored text into html.

Install
-------

	npm install -S bbs-reader

Demo
----

Check the [example folder](https://github.com/eight04/bbs-reader/tree/master/example).

Usage
-----

```js
var bbsReader = require("bbs-reader");
result = bbsReader(ansiString);
```

* `result.html` - the result HTML.
* `result.title` - the title of the article.
* `result.board` - the board name.
* `result.time` - the time string of the article.

Note that bbsReader dosn't decode big5-uao.

Changelog
---------

* 0.2.2 (Jun 24, 2016)

	- Fix a bug within consequent escape code.

* 0.2.1 (Jun 18, 2016)

	- `opacity` -> `color: transparent`.

* 0.2.0 (Jun 18, 2016)

	- Add flash animation.

* 0.1.2 (Jun 18, 2016)

	- Remove line width limit.

* 0.1.1 (Apr 30, 2016)

	- Fix a bug that `.flash` isn't reset with cleanLine.

* 0.1.0 (Apr 30, 2016)

	- First release.
