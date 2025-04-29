const BaseDAO = require('./base-dao');

class AcademicDAO extends BaseDAO {
  async getDegrees() {
    return this.findAll('Degree');
  }

  async getDegreeById(id) {
    return this.findById('Degree', id);
  }

  async getSubjects() {
    return this.findAll('Subject');
  }

  async getSubjectById(id) {
    return this.findById('Subject', id);
  }

  async getSubjectsByDegreeId(degreeId) {
    const query = `
      SELECT s.*
      FROM "Subject" s
      JOIN "DegreeSubject" ds ON s.id = ds.subjectId
      WHERE ds.degreeId = $1
    `;
    
    return this.query(query, [degreeId]);
  }
}

module.exports = AcademicDAO;
