const http = require('http');
const { store } = require('./store');

module.exports = {
  commands: [
    'o',
    'open',
  ],
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
