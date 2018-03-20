const Markup = require('telegraf/markup');

const openButton = Markup
  .keyboard(['Open'])
  .resize()
  .extra();

module.exports = {
  openButton,
};
