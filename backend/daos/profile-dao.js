const BaseDAO = require('./base-dao');

class ProfileDAO extends BaseDAO {
  async getProfileById(id) {
    return this.findById('Profile', id);
  }

  async getProfileByUserId(userId) {
    const profiles = await this.findByField('Profile', 'userId', userId);
    return profiles.length ? profiles[0] : null;
  }

  async createProfile(profileData) {
    return this.create('Profile', profileData);
  }

  async updateProfile(id, profileData) {
    return this.update('Profile', id, profileData);
  }

  async getStudentGrades(profileId) {
    return this.findByField('StudentGrade', 'profileId', profileId);
  }
}

module.exports = ProfileDAO;
