const getText = () => `
  Welcome to PB's door bot!

  If you don't have a token, contact @yangwao

  The token you chose is unique to you, which means that you are responsible for whatever that token is used for, so don't share it with anyone!

  If you already have a token, you can try opening the doors already with this command:

     /open yourToken

  After that, if the token was valid, the bot will remember it and display a button for you, so in order to open the door, all you have to do is press that button. Alternatively, you can still use that command:

    /open

  A lot of commands have shortcuts, and none of them require a slash. "/open yourToken" is equivalent to
  
    o yourToken

  To get help for a certain command, send a message with

    /help thatCommand

  or

    ? thatCommand

  You can see this message again with this command

    /start

  For a list of available commands, use

    /list
`;

module.exports = {
  triggers: [
    'start',
  ],
  help: 'initiate conversation',
  invoke() {
    return {
      text: getText(),
    };
  },
};
