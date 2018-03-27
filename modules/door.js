const http = require('http');
const log = require('./log');
const store = require('./store');
const {
  buttonFromDoorAction,
  emptyKeyboard,
} = require('./markup');

const logValidUse = (action, { from }) => {
  log(`door: id "${from.id}" with info "${from.first_name}|${from.last_name}|${from.username}" used action "${action}" succesfully`);
};
const logInvalidUse = (action, { from }) => {
  log(`door: id "${from.id}" with info "${from.first_name}|${from.last_name}|${from.username}" tried to use action "${action}" unsuccesfully`);
};

const errorToBriefMap = {
  'your token is invalid': 'invalid token',
  'your action is invalid': 'invalid action',
  'already processing a different request': 'debounced',
};
const errorToShorter = (error) => {
  for (const key in errorToBriefMap) {
    if (error.startsWith(key)) {
      return errorToBriefMap[key];
    }
  }

  return 'unknown error';
};
const useActionFromToken = (action, token, { from }) => new Promise((resolve, reject) => {
  http.get(`http://door.bar/api/phone/${action}/${token}`, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      console.error('doors.js', res);
      reject('internal');
      return;
    }

    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      if (rawData.startsWith('OK')) {
        if (store.get({ user: from.id, property: 'token' }).success) {
          resolve('success');
        } else {
          store.set({ user: from.id, property: 'token', value: token });
          resolve('succes and store');
        }
        logValidUse(action, { from });
        return;
      }

      const [heading, message] = rawData.split('ERROR: ');

      reject(errorToShorter(message));
      logInvalidUse(action, { from });
    });
  });
});
const friendlyUseActionFromToken = (action, token, { from }) =>
  useActionFromToken(action, token, { from })
    .then((answer) => {
      const response = {
        markup: buttonFromDoorAction(action),
      };

      switch (answer) {
        case 'success':
          response.text = 'Opening the doors! Listen to a buzz in ~14s and push the door!';
          break;
        case 'success and store':
          response.text = 'Opening the doors, and storing your token, so you won\'t have to type it again :) Listen to a buzz in ~14s and push the door';
          break;
        default:
          response.text = answer;
      }

      return response;
    })
    .catch((answer) => {
      const response = {};
      switch (answer) {
        case 'internal':
          response.text = 'Something went wrong internally :/ Please contact @towc0';
          break;
        case 'invalid token':
          response.text = 'Looks like your token is not valid :/ It might be a typo. If you can\'t remember it or don\'t think you have one, contact @towc0';
          response.markup = emptyKeyboard;
          break;
        case 'debounced':
          response.text = 'Someone is opening the door right now :) If it doesn\'t, try again in a couple of seconds';
          break;
        default:
          response.text = 'Some unknown error happened. Please tell @towc0 so he can figure it out';
          log(`error-unknown: ${answer}`);
      }

      return response;
    });

module.exports = {
  useActionFromToken,
  friendlyUseActionFromToken,
};
