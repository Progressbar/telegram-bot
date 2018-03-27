const store = require('./../modules/store');
const { commandInitiator } = require('./../env');

const triggers = [
  'store',
  's',
];

const actions = [
  {
    triggers: ['s', 'set'],
    fn: store.set,
    help: `assigns a value to a property in the store.\nsyntax: \`${commandInitiator}store set <property> <value>\``,
  },
  {
    triggers: ['g', 'get'],
    fn: store.get,
    help: `prints a property from the store.\nsyntax: ${commandInitiator}store get <property>`,
  },
  {
    triggers: ['d', 'del', 'delete'],
    fn: store.delete,
    help: `removes a property from the store.\nsyntax: ${commandInitiator}store delete <property>`,
  },
];

const codeDelimiter = '\n```\n';
const help = `${codeDelimiter}
${actions.map(({ triggers: actionTriggers, help: actionHelp }) =>
    `${actionTriggers.join(', ').padEnd(20, ' ')}\n  ${actionHelp.split('\n').join('\n  ')}`
  ).join('\n')}

example: to set your token, use:

  ${commandInitiator}store set token myToken

and then you'll be able to just type

  ${commandInitiator}open

to open the door!
${codeDelimiter}`;

module.exports = {
  triggers,
  help,
  invoke({ params }, { message: { from } }) {
    const [actionString, property, value] = params;

    if (!actionString || !property) {
      return {
        text: `Uhm, check your syntax:\n${this.help}`,
        isMarkdown: true,
      };
    }

    const actionStringLowercase = actionString.toLowerCase();

    const action = actions.find(({ triggers: actionTriggers }) => actionTriggers.includes(actionStringLowercase));

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
