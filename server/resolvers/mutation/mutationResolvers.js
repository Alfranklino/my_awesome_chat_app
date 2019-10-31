const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Promise = require("bluebird");

// This Salt is randomly generated each time;
var salt = bcrypt.genSaltSync(10);
module.exports = {
  Mutation: {
    // This Mutation is a combination of a signup + a login from the cookie resulted
  }
};
