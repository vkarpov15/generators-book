'use strict';

// Includes
const acquit = require('acquit');
const beautify = require('js-beautify');
const co = require('co');
const fs = require('fs');
const marked = require('marked');
const nightmare = require('nightmare');
const thunkify = require('thunkify');

// Plugins
const beautifyOpts = { indent_size: 2 };
require('acquit-ignore')();
acquit.transform(block => { block.code = beautify(block.code, beautifyOpts) });
require('acquit-markdown')(acquit, { it: true });

var highlight = require('highlight.js');
marked.setOptions({
  highlight: function(code) {
    return highlight.highlight('JavaScript', code).value;
  }
});

// Build the PDF
co(function*() {
  const cover = yield thunkify(fs.readFile)('./content/cover.html');
  const toc = yield thunkify(fs.readFile)('./content/toc.md');
  const chapter1 = yield thunkify(fs.readFile)('./chapters/chapter1.test.js');
  const chapter2 = yield thunkify(fs.readFile)('./chapters/chapter2.test.js');
  const css = yield thunkify(fs.readFile)('./style.css');
  let markdown = acquit.parse(`
    ${chapter1.toString()}\n\n
    ${chapter2.toString()}`);

  const re = new RegExp('@import:[\\S]+', 'g');
  const matches = markdown.match(re);
  if (matches) {
    matches.forEach(function(statement) {
      const file = statement.substr('@import:'.length);
      const data = fs.readFileSync(file, 'utf8');
      markdown = markdown.replace(statement, data);
    });
  }

  markdown = markdown.replace(/acquit:ignore:start/g, '');
  markdown = markdown.replace(/acquit:ignore:end/g, '');

  const content = `
    <link href='http://fonts.googleapis.com/css?family=Titillium+Web' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono' rel='stylesheet' type='text/css'>
    <style>
      ${css}
    </style>
    <div id="content">
      ${cover.toString()}
      ${marked(toc.toString())}
      ${marked(markdown)}
    </div>
    <script type="text/javascript">
      var start = 3400;
      var delta = 1680;
      for (var i = 2; i < 16; ++i) {
        var height = start + (i - 2) * delta;
        document.write('<div class="page-num" style="top:' + height + 'px;">' + (i - 1) + '</div>');
      }
    </script>
  `;

  yield thunkify(fs.writeFile)('./book.html', content);

  const browser = nightmare({ show: false });
  browser.on('console', function(type, arg) {
    console.log(type, '::', arg);
  });
  yield browser.goto(`file://${__dirname}/book.html`).
    pdf('./80-20-guide-to-es2015-generators.pdf', { marginsType: 1 }).
    end();

  console.log('done');
  process.exit(0);
}).catch(error => console.error(error) && process.exit(1));
