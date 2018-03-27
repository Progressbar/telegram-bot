const { commandInitiator } = require('./../env');

const {
  door,
  store,
} = require('./../modules');

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
const useToken = (token, { from }, send) =>
  door.friendlyUseActionFromToken('open', token, { from })
    .then(response => send(response));

module.exports = {
  triggers: [
    'open',
    'o',
  ],
  help,
  invoke({ paramsString: token }, { message: { from } }, send) {
    if (token) {
      useToken(token, { from }, send);
      return;
    }

    const {
      success: tokenIsStored,
      output: tokenFromStore,
    } = store.get({ user: from.id, property: 'token' });

    if (tokenIsStored) {
      useToken(tokenFromStore, { from }, send);
      return;
    }

    return {
      text: 'Can\'t find your token. Try `/o <token>` or register with `/store set token <token>` :/',
    };
  },
};
