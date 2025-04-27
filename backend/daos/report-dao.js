const BaseDAO = require('./base-dao');

class ReportDAO extends BaseDAO {
  async createCareerReport(reportData) {
    return this.create('CareerReport', reportData);
  }

  async getCareerReportById(id) {
    return this.findById('CareerReport', id);
  }

  async getCareerReportsByProfileId(profileId) {
    const query = `
      SELECT cr.*, ct.type as careerType, cf.name as careerFieldName
      FROM "CareerReport" cr
      LEFT JOIN "CareerType" ct ON cr.careerTypeId = ct.id
      LEFT JOIN "CareerField" cf ON ct.careerFieldId = cf.id
      WHERE cr.profileId = $1
      ORDER BY cr.createdAt DESC
    `;
    
    return this.query(query, [profileId]);
  }

  async createSkillAssessment(assessmentData) {
    return this.create('SkillAssessment', assessmentData);
  }

  async getSkillAssessmentsByReportId(reportId) {
    const query = `
      SELECT sa.*, s.name as skillName, s.description as skillDescription
      FROM "SkillAssessment" sa
      JOIN "Skill" s ON sa.skillId = s.id
      WHERE sa.careerReportId = $1
    `;
    
    return this.query(query, [reportId]);
  }

  async updateSkillAssessment(id, assessmentData) {
    return this.update('SkillAssessment', id, assessmentData);
  }
}

module.exports = ReportDAO;
