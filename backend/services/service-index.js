const ProfileService = require('./profile-service');
const SkillService = require('./skill-service');
const CareerRecommendationService = require('./career-recommendation-service');
const ReportService = require('./report-service');

// initializing all services with required DAOs
function initializeServices(daos) {
  return {
    profileService: new ProfileService(
      daos.userDAO,
      daos.profileDAO,
      daos.academicDAO
    ),
    
    skillService: new SkillService(
      daos.profileDAO,
      daos.skillsDAO,
      daos.academicDAO
    ),
    
    careerRecommendationService: new CareerRecommendationService(
      daos.profileDAO,
      daos.skillsDAO,
      daos.careerDAO
    ),
    
    reportService: new ReportService(
      daos.reportDAO,
      daos.careerDAO,
      daos.skillsDAO
    )
  };
}

module.exports = {
  initializeServices
};
