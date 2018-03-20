const store = require('./../store');
const { commandInitiator } = require('./../env');

const commands = [
  'store',
  's',
];

const actions = [
  {
    commands: ['s', 'set'],
    fn: store.set,
    help: `assigns a value to a property in the store.\nsyntax: \`${commandInitiator}store set <property> <value>\``,
  },
  {
    commands: ['g', 'get'],
    fn: store.get,
    help: `prints a property from the store.\nsyntax: ${commandInitiator}store get <property>`,
  },
  {
    commands: ['d', 'del', 'delete'],
    fn: store.delete,
    help: `removes a property from the store.\nsyntax: ${commandInitiator}store delete <property>`,
  },
];

const help = `
${actions.map(({ commands: actionCommands, help: actionHelp }) =>
    `${actionCommands.join(', ').padEnd(20, ' ')}\n  ${actionHelp.split('\n').join('\n  ')}`
  ).join('\n')}

example: to set your token, use:

  ${commandInitiator}store set token myToken

and then you'll be able to just type

  ${commandInitiator}open

to open the door!
`;

module.exports = {
  commands,
  help,
  trigger({ params }, { message: { from } }) {
    const [actionString, property, value] = params;

    if (!actionString || !property) {
      return {
        text: `Uhm, check your syntax:\n${this.help}`,
      };
    }

    const actionStringLowercase = actionString.toLowerCase();

    const action = actions.find(({ commands: actionCommands }) => actionCommands.includes(actionStringLowercase));

    if (action) {
      return {
        text: action.fn({ user: from.id, property, value }).msgOutput,
      };
    }
    return {
      text: 'store: couldn\'t find your action :/',
    };
  },
  store,
};
