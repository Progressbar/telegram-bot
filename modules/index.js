const { basePath } = require('./../env');

const moduleNames = [
  'commandHelpers',
  'log',
  'markup',
  'store',
  'door',
];

const moduleExports = {};

moduleNames.forEach((moduleName) => {
  moduleExports[moduleName] = require(`${basePath}/modules/${moduleName}`);
});

module.exports = moduleExports;
