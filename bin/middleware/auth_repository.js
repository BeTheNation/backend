const global_config = require('../helper/global_config');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  isValidPassword(password) {
    return this.password === password;
  }
}

module.exports.findByUsername = (username, cb) => {
  const userDatas = global_config.get('/basicAuthApi');
  let userData;

  userData = userDatas.map((value) => {
    if (value.username === username) {
      return value;
    }
    return '';
  });

  const user = new User(userData[0].username, userData[0].password);

  cb(user);
};
