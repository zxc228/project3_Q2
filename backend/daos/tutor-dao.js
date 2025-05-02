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
  async searchStudentsByName(searchTerm) {
    const query = `
      SELECT p.id, p.firstName, p.lastName, p.degreeId, u.email, p.tutorId
      FROM "Profile" p
      JOIN "User" u ON p.userId = u.id
      WHERE 
        LOWER(p.firstName) LIKE LOWER($1) OR
        LOWER(p.lastName) LIKE LOWER($1)
      LIMIT 20
    `;
    
    return this.query(query, [`%${searchTerm}%`]);
  }
}

module.exports = TutorDAO;
