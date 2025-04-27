const BaseDAO = require('./base-dao');

class AuthDAO extends BaseDAO {
  async getUserByEmail(email) {
    const users = await this.findByField('User', 'email', email);
    return users.length ? users[0] : null;
  }

  async createUser(userData) {
    return this.create('User', userData);
  }
}

module.exports = AuthDAO;
