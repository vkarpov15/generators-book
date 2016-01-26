'use strict';

const co = require('co');
const express = require('express');
const jade = require('jade');

const app = express();

app.use(express.static('./bin'));

app.listen(process.env.PORT || 3000);
