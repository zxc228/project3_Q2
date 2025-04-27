const BaseDAO = require('./base-dao');

class TutorDAO extends BaseDAO {
  async getTutors() {
    return this.findAll('TutorProfile');
  }

  async getTutorById(id) {
    return this.findById('TutorProfile', id);
  }

  async getTutorByUserId(userId) {
    const tutors = await this.findByField('TutorProfile', 'userId', userId);
    return tutors.length ? tutors[0] : null;
  }

  async createTutor(tutorData) {
    return this.create('TutorProfile', tutorData);
  }

  async updateTutor(id, tutorData) {
    return this.update('TutorProfile', id, tutorData);
  }

  async getStudentsByTutorId(tutorId) {
    return this.findByField('Profile', 'tutorId', tutorId);
  }
}

module.exports = TutorDAO;
