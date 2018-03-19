module.exports = {
  telegrafBotToken: 'xxxxxxxxx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  commandInitiator: '/',
  basePath: `${__dirname}/`,
  encodeBasic: str => Buffer.from(str).toString('base64'),
  decodeBasic: str => Buffer.from(str, 'base64').toString(),
};
