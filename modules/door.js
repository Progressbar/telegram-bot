const http = require('http');
const { commandInitiator } = require('./../env');
const { store } = require('./store');

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
  trigger({ params }, { from }, { reply }) {
    const [token] = params;

    if (token) {
      http.get(`http://door.bar/api/phone/open/${token}`, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          console.error('doors.js', statusCode);
          reply('ERROR: something went wrong on the inside :/ Please contact @towc0');
          return;
        }

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          reply(rawData);
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
          reply('ERROR: something went wrong on the inside :/ Please contact @towc0');
          return;
        }

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          reply(rawData);
        });
      });

      return false;
    }

    return 'Can\'t find your token. Try `/o <token>` or register with `/store set token <token>` :/';
  },
};
