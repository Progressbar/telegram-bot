const Markup = require('telegraf/markup');

const emptyKeyboard = Markup
  .keyboard()
  .resize()
  .extra();

const openButton = Markup
  .keyboard(['Open'])
  .resize()
  .extra();

const answerButton = Markup
  .keyboard(['Answer'])
  .resize()
  .extra();

const buttonFromDoorAction = (action) => {
  switch (action) {
    case 'open':
      return openButton;
    case 'answer':
      return answerButton;
    default:
      return emptyKeyboard;
  }
};

module.exports = {
  openButton,
  answerButton,
  buttonFromDoorAction,
  emptyKeyboard,
};
