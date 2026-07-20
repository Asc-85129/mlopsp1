const assert = require("assert");
const config = require("./config");

assert.ok(config.port, "config.port must be defined");
assert.ok(config.tokenExpiryMinutes > 0, "tokenExpiryMinutes must be positive");

console.log("All tests passed.");
