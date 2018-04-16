const { commandInitiator } = require('./../env');
const commands = require('./index.js');

module.exports = {
  triggers: [
    'list',
    'l',
  ],
  help: 'prints a list of commands',
  invoke() {
    return {
      text: commands.map(({ triggers: [mainTrigger] }) => `${commandInitiator}${mainTrigger}`).join('\n'),
    };
  },
};
