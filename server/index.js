'use strict';

const co = require('co');
const express = require('express');
const http = require('http');
const jade = require('jade');
const superagent = require('superagent');

const app = express();

app.use((req, res, next) => {
  if (req.originalUrl.indexOf('80-20-guide') !== -1) {
    superagent.get('http://s3.amazonaws.com/valeri.karpov.mongodb/80-20-guide-to-es2015-generators.tgz').pipe(res);
    return;
  }
  next();
});
app.use(express.static('./bin'));

app.listen(process.env.PORT || 3000);
