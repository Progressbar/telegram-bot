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
      http.get(`http://door.bar/api/phone/open/${token}`, (err, data) => {
        if (err) {
          console.error(err);
          reply('ERROR: something went wrong on the inside :/ Please contact @towc0');
          return;
        }

        reply(data);
      });

      return false;
    }

    const tokenFromStore = store.get({ user: from.id, property: 'token' }).output;
    if (tokenFromStore) {
      http.get(`http://door.bar/api/phone/open/${token}`, (err, data) => {
        if (err) {
          console.error(err);
          reply('ERROR: something went wrong on the inside :/ Please contact @towc0');
          return;
        }

        reply(data);
      });

      return false;
    }

    return 'Can\'t find your token. Try `/o <token>` or register with `/store set token <token>` :/';
  },
};
