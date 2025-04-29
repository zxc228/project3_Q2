const BaseDAO = require('./base-dao');

class UserDAO extends BaseDAO {
  async getUserById(id) {
    return this.findById('User', id);
  }

  async getUserByEmail(email) {
    const users = await this.findByField('User', 'email', email);
    return users.length ? users[0] : null;
  }

  async createUser(userData) {
    return this.create('User', userData);
  }

  async updateUser(id, userData) {
    return this.update('User', id, userData);
  }
}

module.exports = UserDAO;
