const { commandInitiator = '/' } = require('./../env');

const removeInitiatorIfPresent = (command, isPresent) => {
  if (isPresent) {
    return command.substring(commandInitiator.length);
  }
  return command;
};

const extractCommandSyntax = (msg) => {
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

const commandMatches = ({ triggers, initiatorOnly }, { command, hasInitiator }) => {
  if (triggers.includes(command)) {
    if (initiatorOnly) {
      return hasInitiator;
    }
    return true;
  }
  return false;
};

const findCommand = (commands, extractedCommand) =>
  commands.find(command => commandMatches(command, extractedCommand));

module.exports = {
  removeInitiatorIfPresent,
  extractCommandSyntax,
  findCommand,
};
