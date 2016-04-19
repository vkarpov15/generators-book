'use strict';

const Keen = require('keen-js');
const co = require('co');
const express = require('express');
const http = require('http');
const jade = require('jade');
const superagent = require('superagent');

const app = express();

const client = new Keen({
  projectId: '56a7809190e4bd55b2e26b46',
  writeKey: '381bed9435318540268d939c397b43d7bc280626dcf166eb1b41f7cc386a5f641e2e25f9b7401bfff7f4e01793306b2988d2e9ab74b9d94adb908e71c6dab926d1bde5f3ff16eee22459c2850db61caefafbb8f9172a60830977b5caa398cd93'
});

app.use((req, res, next) => {
  if (req.originalUrl.indexOf('80-20-guide') !== -1) {
    client.addEvent('track', { type: 'download' });
    superagent.get('http://s3.amazonaws.com/valeri.karpov.mongodb/80-20-guide-to-es2015-generators.tgz').pipe(res);
    return;
  }
  next();
});
app.use(express.static('./bin'));

app.listen(process.env.PORT || 3000);
