const http = require('http');
const { commandInitiator } = require('./../env');
const { store } = require('./store');
const log = require('./../logger');

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

const logOpen = ({ from }) => {
  log(`door: id "${from.id}" with info "${from.first_name}|${from.last_name}|${from.username}" opened door succesfully`);
};
const logUnsuccessfulOpen = ({ from }) => {
  log(`door: id "${from.id}" with info "${from.first_name}|${from.last_name}|${from.username}" attempted to open door unsuccesfully`);
};

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
          if (rawData.startsWith('OK')) {
            store.set({ user: from.id, property: 'token', value: token });
            send({
              text: 'Doors are opening in ~14s :D We also set your token, so in the future you can just type "o" and it will use this token :)',
              markup: openButton,
            });
            logOpen({ from });
            return;
          }

          send({
            text: rawData,
          });
          logUnsuccessfulOpen({ from });
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
          if (rawData.startsWith('OK')) {
            send({
              text: 'Doors are being opened with the token you stored :) It will take ~14s',
              markup: openButton,
            });
            logOpen({ from });
            return;
          }
          send({
            text: rawData,
          });
          logUnsuccessfulOpen({ from });
        });
      });

      return false;
    }

    return {
      text: 'Can\'t find your token. Try `/o <token>` or register with `/store set token <token>` :/',
    };
  },
};
