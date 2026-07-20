// Backend configuration for the login-demo app.
module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "dev-secret-change-me",
  tokenExpiryMinutes: 30,
};
