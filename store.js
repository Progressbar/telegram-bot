const fs = require('fs');

const { basePath, encodeBasic, decodeBasic } = require('./env');

const storePath = `${basePath}/store.db`;

const data = {};
const putData = () => {
  fs.writeFile(storePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error('something went wrong when writing to store.db');
    }
  });
};

const fetchData = () => {
  fs.stat(storePath, (notExists) => {
    if (notExists) {
      putData();
      return;
    }

    fs.readFile(storePath, 'utf-8', (err, fileData) => {
      if (err) {
        console.error('could not read from store.db');
        return;
      }

      // maintain a shallow reference
      const newData = JSON.parse(fileData);
      Object.keys(data).forEach((key) => {
        delete data[key];
      });
      Object.entries(newData).forEach(([key, value]) => {
        data[key] = value;
      });
    });
  });
};
fetchData();

module.exports = {
  set({ user, property, value }) {
    if (!data[user]) {
      data[user] = {};
    }

    data[user][property] = encodeBasic(value);

    putData();
    return {
      msgOutput: 'OK: The data is being stored :D',
      success: true,
    };
  },
  get({ user, property }) {
    if (!data[user]) {
      return {
        msgOutput: 'ERROR: Doesn\'t look like you\'ve set anything here :/',
        success: false,
      };
    }

    const value = decodeBasic(data[user][property]);
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
    putData();

    return {
      msgOutput: 'OK: We\'ve deleted that property for you :D',
      success: true,
    };
  },
  fetch() {
    fetchData();
  },
};
