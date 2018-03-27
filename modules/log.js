const fs = require('fs');
const { basePath } = require('./../env');

const stream = fs.createWriteStream(`${basePath}/../logs.log`, { flags: 'a' });

const log = (...args) => {
  const str = `${new Date().toJSON()}|telegram:${args.join(', ')}`;
  stream.write(`${str}\n`);
  // eslint-disable-next-line no-console
  console.log(str);
};

module.exports = log;
