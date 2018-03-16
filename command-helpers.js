const { commandInitiator = '/' } = require('./env');

const removeInitiatorIfPresent = (command, isPresent) => {
  if (isPresent) {
    return command.substring(commandInitiator.length);
  }
  return command;
};

const extractCommand = (msg) => {
  const [unfilteredCommand, ...params] = msg.split(' ');
  const hasInitiator = unfilteredCommand.startsWith(commandInitiator);

  const command = removeInitiatorIfPresent(unfilteredCommand, hasInitiator);

  return {
    command: command.toLowerCase(),
    hasInitiator,
    params,
    paramsString: params.join(' '),
  };
};

const findBotModule = (botModules, { command, hasInitiator }) => botModules.find(({ commands, initiatorOnly }) => commands.includes(command) && (initiatorOnly ? hasInitiator : true));

module.exports = {
  removeInitiatorIfPresent,
  extractCommand,
  findBotModule,
};
