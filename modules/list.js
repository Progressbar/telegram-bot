const { commandInitiator } = require('./../env');
const botModules = require('./index.js');

module.exports = {
  commands: [
    'list',
    'start',
    'l'
  ],
  help: 'prints a list of commands',
  trigger() {
    return botModules.map(({ commands: [mainCommand] }) =>
      `${commandInitiator}${mainCommand}`
    ).join(`\n`);
  },
};
