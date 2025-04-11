const userService = require("../services/userService");

async function register(req, res) {
  const { username, password } = req.body;
  try {
    const user = await userService.registerUser(username, password);
    res.status(201).json({ message: "User registered", user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports = {
  register
};