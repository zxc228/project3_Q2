const BaseDAO = require('./base-dao');

class CareerDAO extends BaseDAO {
  async getCareerFields() {
    return this.findAll('CareerField');
  }

  async getCareerFieldById(id) {
    return this.findById('CareerField', id);
  }

  async getCareerTypes() {
    return this.findAll('CareerType');
  }

  async getCareerTypeById(id) {
    return this.findById('CareerType', id);
  }

  async getCareerTypesByFieldId(fieldId) {
    return this.findByField('CareerType', 'careerFieldId', fieldId);
  }

  async getCareerSkills() {
    return this.findAll('CareerSkill');
  }

  async getCareerSkillsByTypeId(careerTypeId) {
    const query = `
      SELECT cs.*, s.name as skillName, s.description as skillDescription
      FROM "CareerSkill" cs
      JOIN "Skill" s ON cs.skillId = s.id
      WHERE cs.careerTypeId = $1
    `;
    
    return this.query(query, [careerTypeId]);
  }
}

module.exports = CareerDAO;
