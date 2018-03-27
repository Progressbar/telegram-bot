// hack-alert: module 'help' and 'list' are parsed after declaring the exports
const commandNames = [
  'store',
  'open',
  'answer',
];

const parseCommandName = (name) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const command = require(`./${name}`);
  command.triggers = command.triggers.map(trigger => trigger.toLowerCase());
  command.name = name;

  return command;
};

const commands = commandNames.map(parseCommandName);

module.exports = commands;

commands.push(parseCommandName('list'));
commands.push(parseCommandName('help'));
