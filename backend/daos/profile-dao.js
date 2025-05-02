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

  async createGrade(gradeData) {
    return this.create('StudentGrade', gradeData);
  }

  async updateGrade(id, gradeData) {
    return this.update('StudentGrade', id, gradeData);
  }

  async getStudentGradeBySubjectId(profileId, subjectId) {
    const query = `
      SELECT * FROM "StudentGrade"
      WHERE "profileId" = $1 AND "subjectId" = $2
    `;
    
    const result = await this.query(query, [profileId, subjectId]);
    return result.length ? result[0] : null;
  }

  async getCompletedCredits(profileId) {
    const query = `
      SELECT SUM(s.credits) as completedCredits
      FROM "StudentGrade" sg
      JOIN "Subject" s ON sg.subjectId = s.id
      WHERE sg.profileId = $1 AND sg.status = 'COMPLETED'
    `;
  }

  // this method is needed to check user permissions before accessing any file
  async getProfileIdByFilePath(filePath) {
    const query = `
      SELECT id FROM "Profile" 
      WHERE "academicRecordPath" = $1 OR "cvPath" = $1
    `;
    
    const result = await this.query(query, [filePath]);
    return result.length ? result[0].id : null;
  }
}

module.exports = ProfileDAO;
