const { commandInitiator } = require('./../env');
const commands = require('./index.js');
const {
  commandHelpers: { findCommand, extractCommandSyntax },
} = require('./../modules');

module.exports = {
  triggers: [
    'help',
    'h',
    '?',
  ],
  invoke({ params }) {
    const command = findCommand(commands, extractCommandSyntax(params.join(' ')));

    const codeDelimiter = '\n```\n';
    if (command) {
      return {
        text: `${codeDelimiter}${command.triggers.join(', ')}\n${command.help.trim()}${codeDelimiter}`,
        isMarkdown: true,
      };
    }

    return {
      text: `help: that command doesn't seem to exist. Maybe try ${commandInitiator}list to list all commands`,
    };
  },
};
