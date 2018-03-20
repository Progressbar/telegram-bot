const Telegraf = require('telegraf');
const { telegrafBotToken } = require('./env');
const { extractCommand, findBotModule } = require('./command-helpers');
const botModules = require('./commands');

const bot = new Telegraf(telegrafBotToken);

bot.use(Telegraf.log());

const triggerReply = (ctx, output) => {
  const { text, markup, isMarkdown } = output;

  const reply = isMarkdown
    ? ctx.replyWithMarkdown
    : ctx.reply;

  if (markup) {
    reply(text, markup);
  } else {
    reply(text);
  }
};

bot.on('text', (ctx, next) => {
  const msg = ctx.message.text;
  const extractedCommand = extractCommand(msg);

  const botModule = findBotModule(botModules, extractedCommand);

  if (botModule) {
    const localTriggerReply = output => triggerReply(ctx, output);
    const output = botModule.trigger(extractedCommand, ctx, localTriggerReply);

    if (output) {
      localTriggerReply(output);
    }
  }

  next();
});

bot.startPolling();
