const store = require('./store');

const commands = [
  'store',
  's',
];

const actions = [
  {
    commands: ['s', 'set'],
    fn: store.set,
    help: '',
  },
  {
    commands: ['g', 'get'],
    fn: store.get,
  },
  {
    commands: ['d', 'del', 'delete'],
    fn: store.delete,
  },
];

const help = `${commands.join(', ')}

${actions.map(({ commands: actionCommands, help: actionHelp }) =>
    `${actionCommands.join(', ').padEnd(20, ' ')}-- ${actionHelp}`)}
`;

module.exports = {
  commands,
  help,
  trigger({ params }, { from }) {
    const [actionString, property, value] = params;

    if (!actionString || !property) {
      return 'Uhm, check your syntax: `help store`';
    }

    const actionStringLowercase = actionString.toLowerCase();

    const action = actions.find(({ commands: actionCommands }) => actionCommands.includes(actionStringLowercase));

    if (action) {
      return action.fn({ user: from.id, property, value }).msgOutput;
    }
    return 'store: couldn\'t find your action :/';
  },
  store,
};
