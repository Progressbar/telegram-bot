const { commandInitiator } = require('./../env');

const {
  door,
  store,
} = require('./../modules');

const help = `
  answers the door with a supplied token

  syntax: ${commandInitiator}answer [<token>]

  example: answer with your token
    
    ${commandInitiator}answer myToken

  example: answer with stored token

    before answering, store your token:

      ${commandInitiator}store set token myToken

    now you'll be able to use your token anytime!

      ${commandInitiator}answer
`;
const useToken = (token, { from }, send) =>
  door.friendlyUseActionFromToken('answer', token, { from })
    .then(response => send(response));

module.exports = {
  triggers: [
    'answer',
    'a',
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
      text: 'Can\'t find your token. Try `/a <token>` or register with `/store set token <token>` :/',
    };
  },
};
