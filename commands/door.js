const http = require('http');
const { commandInitiator } = require('./../env');
const { store } = require('./store');

const { openButton } = require('./../custom-markup');

const commands = [
  'open',
  'o',
];
const help = `
  opens the door with a supplied token

  syntax: ${commandInitiator}open [<token>]

  example: open with your token
    
    ${commandInitiator}open myToken

  example: open with stored token

    before opening, store your token:

      ${commandInitiator}store set token myToken

    now you'll be able to use your token anytime!

      ${commandInitiator}open
`;

module.exports = {
  commands,
  help,
  trigger({ params }, { message: { from } }, send) {
    const [token] = params;

    if (token) {
      http.get(`http://door.bar/api/phone/open/${token}`, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          console.error('doors.js', statusCode);
          send({
            text: 'ERROR: something went wrong on the inside :/ Please contact @towc0',
          });
          return;
        }

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          send({
            text: rawData,
            markup: rawData.startsWith('OK') ? openButton : false,
          });
        });
      });

      return false;
    }

    const tokenFromStore = store.get({ user: from.id, property: 'token' }).output;
    if (tokenFromStore) {
      http.get(`http://door.bar/api/phone/open/${tokenFromStore}`, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          console.error('doors.js', statusCode);
          send({
            text: 'ERROR: something went wrong on the inside :/ Please contact @towc0',
          });
          return;
        }

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          send({
            text: rawData,
            markup: rawData.startsWith('OK') ? openButton : false,
          });
        });
      });

      return false;
    }

    return {
      text: 'Can\'t find your token. Try `/o <token>` or register with `/store set token <token>` :/',
    };
  },
};
