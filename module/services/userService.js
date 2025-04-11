const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return await user.save();
}

module.exports = {
  registerUser
};