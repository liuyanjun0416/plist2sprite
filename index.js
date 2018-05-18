const version = require("./package.json").version;
const {parse} = require('./src/parse');

module.exports = {
  version: version,
  parse:parse,
};