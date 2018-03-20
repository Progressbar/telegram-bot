// hack-alert: module 'help' and 'list' are parsed after declaring the exports
const botModuleNames = [
  'store',
  'door',
];

const parseModuleName = (name) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const botModule = require(`./${name}`);
  botModule.commands = botModule.commands.map(command => command.toLowerCase());
  botModule.name = name;

  return botModule;
};

const botModules = botModuleNames.map(parseModuleName);

module.exports = botModules;

botModules.push(parseModuleName('list'));
botModules.push(parseModuleName('help'));
