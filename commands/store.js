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
    format: {
      fromId: 'user',
      params: [
        'property',
        'value',
      ],
    },
  },
  {
    triggers: ['af', 'add-flag'],
    fn: store.addFlag,
    help: `adds a flag to a user in the store.\nsyntax: \`${commandInitiator}store add-flag <user-id> <flag>\``,
    format: {
      fromId: 'fromUser',
      params: [
        'user',
        'flag',
      ],
    },
  },
  {
    triggers: ['g', 'get'],
    fn: store.get,
    help: `prints a property from the store.\nsyntax: ${commandInitiator}store get <property>`,
    format: {
      fromId: 'user',
      params: [
        'property',
      ],
    },
  },
  {
    triggers: ['d', 'del', 'delete'],
    fn: store.delete,
    help: `removes a property from the store.\nsyntax: ${commandInitiator}store delete <property>`,
    format: {
      fromId: 'user',
      params: [
        'property',
      ],
    },
  },
  {
    triggers: ['rf', 'rm-flag', 'remove-flag'],
    fn: store.removeFlag,
    help: `removes a flag from a user in the store.\nsyntax: ${commandInitiator}store remove-flag <user-id> <flag>`,
    format: {
      fromId: 'fromUser',
      params: [
        'user',
        'flag',
      ],
    },
  },
];

const codeDelimiter = '\n```\n';
const help = `${codeDelimiter}
${actions.map(({ triggers: actionTriggers, help: actionHelp }) =>
    `${actionTriggers.join(', ').padEnd(20, ' ')}\n  ${actionHelp.split('\n').join('\n  ')}`).join('\n')}

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
    const [actionString, ...actionParams] = params;

    if (!actionString) {
      return {
        text: `Uhm, check your syntax:\n${this.help}`,
        isMarkdown: true,
      };
    }

    const actionStringLowercase = actionString.toLowerCase();

    const action = actions.find(({ triggers: actionTriggers }) => actionTriggers.includes(actionStringLowercase));

    if (action) {
      const {
        fromId: fromIdPropertyName,
        params: paramsPropertyNames,
        requiredParams = paramsPropertyNames.length,
      } = action.format;

      if (actionParams.length < requiredParams) {
        return {
          text: `Uhm, check your syntax:\n${this.help}`,
          isMarkdown: true,
        };
      }

      const calculatedActionParams = {
        [fromIdPropertyName]: from.id,
      };
      actionParams.forEach((param, index) => {
        const paramPropertyName = paramsPropertyNames[index];
        calculatedActionParams[paramPropertyName] = param;
      });

      return {
        text: action.fn(calculatedActionParams).msgOutput,
      };
    }
    return {
      text: 'store: couldn\'t find your action :/',
    };
  },
  store,
};
