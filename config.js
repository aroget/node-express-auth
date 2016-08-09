module.exports = () => {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'prod';
    case 'dev':
      return 'dev';
    default:
      return 'prod';
  }
};