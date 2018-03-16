const { commandInitiator } = require('./../env');
const botModules = require('./index.js');
const { findBotModule, extractCommand } = require('./../command-helpers');

module.exports = {
  commands: [
    'help',
    'h',
    '?',
  ],
  trigger({ params }) {
    const botModule = findBotModule(botModules, extractCommand(params.join(' ')));

    const codeDelimiter = '\n```\n';
    if (botModule) {
      return `${codeDelimiter}${botModule.commands.join(', ')}\n${botModule.help.trim()}${codeDelimiter}`;
    }

    return `help: that command doesn't seem to exist. Maybe try \`${commandInitiator}list\` to list all commands`;
  },
};
