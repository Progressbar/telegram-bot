const Telegraf = require('telegraf');
const { telegrafBotToken } = require('./env');
const { extractCommand, findBotModule } = require('./command-helpers');
const botModules = require('./modules');

const bot = new Telegraf(telegrafBotToken);

bot.use(Telegraf.log());

bot.on('text', (ctx, next) => {
  const msg = ctx.message.text;
  const extractedCommand = extractCommand(msg);

  const botModule = findBotModule(botModules, extractedCommand);

  if (botModule) {
    const output = botModule.trigger(extractedCommand, ctx.message, ctx);

    if (output) {
      ctx.replyWithMarkdown(output);
    }
  }

  next();
});

bot.startPolling();
