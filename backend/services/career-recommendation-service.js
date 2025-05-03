const { 
  calculateCareerFitness, 
  recommendCareers 
} = require('../logic/career-recommendation-logic');

// this is the service for generating career recommendations
class CareerRecommendationService {
  
  // creating a new career recommendation service instance
  constructor(profileDAO, skillsDAO, careerDAO) {
    this.profileDAO = profileDAO;
    this.skillsDAO = skillsDAO;
    this.careerDAO = careerDAO;
  }

  // converting profile skills to the required format -- it is needed for the recommendation algorithm
  _formatProfileSkills(skills) {
    return skills.map(skill => ({
      skillId: skill.skillid,
      skillName: skill.skillname,
      currentLevel: parseFloat(skill.skilllevel) || 0
    }));
  }
  

  // getting recommendations for a specific career
  async getSpecificCareerRecommendation(profileId, careerTypeId) {
    try {
      // validating profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // getting career type information
      const careerType = await this.careerDAO.getCareerTypeById(careerTypeId);
      if (!careerType) {
        throw new Error('Career type not found');
      }

      // getting career field information
      const careerField = await this.careerDAO.getCareerFieldById(careerType.careerFieldId);
      if (!careerField) {
        throw new Error('Career field not found');
      }

      // getting skills information
      const profileSkills = await this.skillsDAO.getProfileSkills(profileId);
      const formattedSkills = this._formatProfileSkills(profileSkills);
      const allSkills = await this.skillsDAO.getSkills();
      
      // getting career skills
      const careerSkills = await this.careerDAO.getCareerSkillsByTypeId(careerTypeId);

      // calculating fitness
      const recommendation = calculateCareerFitness(
        formattedSkills,
        careerSkills,
        careerField,
        careerType,
        allSkills
      );

      return recommendation;
    } catch (error) {
      console.error('Error getting career recommendation:', error);
      throw new Error('Failed to generate career recommendation');
    }
  }

  // getting recommendations for all careers (or filtered set, if the user chose exactly one critera, e.g. career field xor career type)
  async getCareerRecommendations(profileId, options = {}) {
    try {
      // validating profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // getting necessary data
      const profileSkills = await this.skillsDAO.getProfileSkills(profileId);
      const formattedSkills = this._formatProfileSkills(profileSkills);
      const allSkills = await this.skillsDAO.getSkills();
      const careerFields = await this.careerDAO.getCareerFields();
      const careerTypes = await this.careerDAO.getCareerTypes();
      const careerSkills = await this.careerDAO.getCareerSkills();

      // generating recommendations
      const recommendations = recommendCareers(
        formattedSkills,
        careerFields,
        careerTypes,
        careerSkills,
        allSkills,
        options.careerFieldId,
        options.careerType
      );

      return {
        topRecommendations: recommendations.slice(0, 5), // top 5 recommendations
        allRecommendations: recommendations
      };
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      throw new Error('Failed to generate career recommendations');
    }
  }

  // getting all career fields
  async getCareerFields() {
    try {
      return this.careerDAO.getCareerFields();
    } catch (error) {
      console.error('Error getting career fields:', error);
      throw new Error('Failed to retrieve career fields');
    }
  }

  // getting career types by field
  async getCareerTypesByField(fieldId) {
    try {
      return this.careerDAO.getCareerTypesByFieldId(fieldId);
    } catch (error) {
      console.error('Error getting career types:', error);
      throw new Error('Failed to retrieve career types');
    }
  }
  async getCareerSkillsByTypeId(careerTypeId) {
    try {
      return this.careerDAO.getCareerSkillsByTypeId(careerTypeId);
    } catch (error) {
      console.error('Error getting career skills:', error);
      throw new Error('Failed to retrieve career skills');
    }
  }
}

module.exports = CareerRecommendationService;
