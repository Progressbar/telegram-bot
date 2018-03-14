const data = {};

module.exports = {
  set({ user, property, value }) {
    if (!data[user]) {
      data[user] = {};
    }

    data[user][property] = value;
    return {
      msgOutput: 'OK: The data is being stored :D',
      success: true
    };
  },
  get({ user, property }) {
    if (!data[user]) {
      return {
        msgOutput: 'ERROR: Doesn\'t look like you\'ve set anything here :/',
        success: false,
      };
    }

    const value = data[user][property];
    if (!value) {
      return {
        msgOutput: 'ERROR: Can\'t find that property in here :/',
        success: false,
      };
    }

    return {
      msgOutput: `OK: We found it!\n${value}`,
      success: true,
      output: value,
    };
  },
  delete({ user, property }) {
    if (!data[user]) {
      return {
        msgOutput: 'WARN: Looks like you\'ve never set anything here anyway :D',
        success: true,
      };
    }
    if (!data[user][property]) {
      return {
        msgOutput: 'WARN: Looks like you haven\'t set that property anyway :D',
        success: true,
      };
    }

    delete data[user][property];
    return {
      msgOutput: 'OK: We\'ve deleted that property for you :D',
      success: true,
    };
  },
};
