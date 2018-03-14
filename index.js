const Telegraf = require('telegraf');
const { telegrafBotToken, commandInitiator = '/' } = require('./env');

const bot = new Telegraf(telegrafBotToken);

const botModuleNames = [
  'store',
  'door',
];

const botModules = botModuleNames.map((name) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const botModule = require(`./modules/${name}`);
  botModule.commands = botModule.commands.map(command => command.toLowerCase());

  return botModule;
});
const extractCommand = (msg) => {
  const [unfilteredCommand, ...params] = msg.split(' ');
  const hasInitiator = unfilteredCommand.startsWith(commandInitiator);

  const command = hasInitiator
    ? unfilteredCommand.substring(commandInitiator.length)
    : unfilteredCommand;

  return {
    command: command.toLowerCase(),
    hasInitiator,
    params,
    paramsString: params.join(' '),
  };
};

const findBotModule = ({ command, hasInitiator }) => {
  return botModules.find(({ commands, initiatorOnly }) => {
    return commands.includes(command) && (initiatorOnly ? hasInitiator : true);
  });
};

bot.on('text', (ctx, next) => {
  const msg = ctx.message.text;
  const extractedCommand = extractCommand(msg);

  const botModule = findBotModule(extractedCommand);

  if (botModule) {
    const output = botModule.trigger(extractedCommand, ctx.message, ctx);

    if (output) {
      ctx.reply(output);
    }
  }

  next();
});

bot.startPolling();
