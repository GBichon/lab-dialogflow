
const express = require('express');
const path = require('path');
const glob = require('glob');

const matches = glob.sync(path.join(global.appRoot, 'Routes/*.route.js'));
const routerV1 = express.Router();

matches.forEach((item) => {
  const pathParsed = path.parse(item);
  routerV1.use(`/v1/${pathParsed.base.split('.')[0]}`, require(item));
  logger.debug(`route [/v1/${pathParsed.base.split('.')[0]}] added`);
});

module.exports = { v1: routerV1 }; 