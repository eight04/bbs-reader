BBS Reader
==========

A simple service that translate ansi colored text into html.

Demo
----

Check the example folder.

Usage
-----

```js
result = bbsReader(ansiString);
```

* `result.html` - the result HTML.
* `result.title` - the title of the article.
* `result.board` - the board name.
* `result.time` - the time string of the article.

Note that bbsReader dosn't decode big5-uao.
