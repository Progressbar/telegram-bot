const Telegraf = require('telegraf');
const { telegrafBotToken } = require('./env');

const {
  log,
  commandHelpers: { extractCommandSyntax, findCommand },
} = require('./modules');

const commands = require('./commands');

const bot = new Telegraf(telegrafBotToken);

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
  const commandSyntax = extractCommandSyntax(msg);

  const command = findCommand(commands, commandSyntax);

  if (command) {
    const localTriggerReply = output => triggerReply(ctx, output);
    const output = command.invoke(commandSyntax, ctx, localTriggerReply);

    if (output) {
      localTriggerReply(output);
    }
  }

  next();
});

bot.startPolling();
log('app: started');
