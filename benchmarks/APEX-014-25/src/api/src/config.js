/**
 * Application configuration
 */

module.exports = {
  flag: process.env.FLAG || (process.env.FLAG || 'missing-runtime-flag'),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
  port: process.env.PORT || 3014
};
