/**
 * initializing user skills based on their grades and skill-subject mappings
 * 
 * @param {Array} grades - user's academic grades
 * @param {Array} skillMaps - mappings between subjects and skills
 * @param {Array} allSkills - complete list of available skills
 * @returns {Array} array of skill levels for the user
 */
function initializeUserSkills(grades, skillMaps, allSkills) {
  // creating a map to track skill levels
  const skillLevels = new Map();
  
  // initializing all skills with zero values
  allSkills.forEach(skill => {
    skillLevels.set(skill.id, {
      skillId: skill.id,
      skillName: skill.name,
      level: 0,
      count: 0
    });
  });
  
  // processing each grade
  grades.forEach(grade => {
    // only considering completed subjects
    if (grade.status !== 'COMPLETED') return;
    
    // finding all skill maps related to this subject
    const subjectSkillMaps = skillMaps.filter(map => map.subjectId === grade.subjectId);
    
    // updating skill levels based on grades and weights
    subjectSkillMaps.forEach(map => {
      const skillData = skillLevels.get(map.skillId);
      if (skillData) {
        // normalizing grade to 0-5 scale (assuming grades are 0-10)
        const normalizedGrade = (grade.grade / 10) * 5;
        
        // applying weight from skill map
        const weightedGrade = normalizedGrade * map.weight;
        
        // updating weighted average
        skillData.level = ((skillData.level * skillData.count) + weightedGrade) / (skillData.count + 1);
        skillData.count += 1;
        
        skillLevels.set(map.skillId, skillData);
      }
    });
  });
  
  // converting map to array of SkillLevel objects
  return Array.from(skillLevels.values()).map(item => ({
    skillId: item.skillId,
    skillName: item.skillName,
    currentLevel: Math.min(5, Math.max(0, item.level)) // ensuring value is between 0-5
  }));
}

/**
 * calculating the fitness of a user for a specific career field and type
 * 
 * @param {Array} userSkills - user's current skill levels
 * @param {Array} careerSkills - skills required for the career
 * @param {Object} careerField - career field information
 * @param {Object} careerType - career type information
 * @param {Array} allSkills - all skills in the system
 * @returns {Object} career recommendation with fitness score and skill assessments
 */
function calculateCareerFitness(userSkills, careerSkills, careerField, careerType, allSkills) {
  // creating map for quick access to user skills
  const userSkillMap = new Map();
  userSkills.forEach(skill => {
    userSkillMap.set(skill.skillId, skill.currentLevel);
  });
  
  // creating map for quick access to skill names
  const skillNameMap = new Map();
  allSkills.forEach(skill => {
    skillNameMap.set(skill.id, skill.name);
  });
  
  // calculating skill assessments
  const skillAssessments = careerSkills.map(careerSkill => {
    const skillId = careerSkill.skillid || careerSkill.skillId;
    const currentLevel = userSkillMap.get(careerSkill.skillid) || 0;
    const importanceLevel = careerSkill.importancelevel;
    const gap = Math.max(0, importanceLevel - currentLevel);
    
    return {
      skillId,
      skillName: skillNameMap.get(careerSkill.skillid) || 'Unknown Skill',
      currentLevel,
      importanceLevel,
      gap
    };
  });
  
  // calculating average gap (distance) across all skills
  const totalGap = skillAssessments.reduce((sum, assessment) => sum + assessment.gap, 0);
  const averageGap = skillAssessments.length > 0 ? totalGap / skillAssessments.length : 5;
  
  // converting to fitness score (inverting the gap, so 0 gap = 5 fitness, 5 gap = 0 fitness)
  const fitnessScore = 5 - averageGap;
 
  
  return {
    careerFieldId: careerField.id,
    careerFieldName: careerField.name,
    careerTypeId: careerType.id,
    careerType: careerType.type,
    fitnessScore,
    skillAssessments
  };
}

/**
 * recommending careers based on user skills, optionally filtered by field or type
 * 
 * @param {Array} userSkills - user's current skill levels
 * @param {Array} careerFields - all available career fields
 * @param {Array} careerTypes - all available career types
 * @param {Array} careerSkills - all career-skill relationships
 * @param {Array} allSkills - all skills in the system
 * @param {string} [filterFieldId] - optional career field to filter by
 * @param {string} [filterType] - optional career type to filter by ('INTERNSHIP' or 'JOB')
 * @returns {Array} array of career recommendations sorted by fitness score
 */
function recommendCareers(
  userSkills,
  careerFields,
  careerTypes,
  careerSkills,
  allSkills,
  filterFieldId,
  filterType
) {
  const recommendations = [];
  

  
  // filtering career fields if specified
  const fieldsToCheck = filterFieldId ? 
    careerFields.filter(field => field.id === filterFieldId) : 
    careerFields;
  
  // checking each relevant career field
  fieldsToCheck.forEach(careerField => {
    // getting career types for this field, filtered if necessary
    
    const typesForField = careerTypes
      .filter(type => type.careerfieldid === careerField.id)
      .filter(type => filterType ? type.type === filterType : true);

    // calculating fitness for each type
    typesForField.forEach(careerType => {
      // getting skills for this career type
      const relevantCareerSkills = careerSkills.filter(
        skill => skill.careertypeid === careerType.id
      );
      
      
      // calculating fitness
      const recommendation = calculateCareerFitness(
        userSkills,
        relevantCareerSkills,
        careerField,
        careerType,
        allSkills
      );
      
      recommendations.push(recommendation);
    });
  });
  
  // sorting by fitness score (highest first)
  console.log('\n--- FINAL RECOMMENDATIONS ---');
  recommendations.forEach(r => {
    console.log(`${r.careerType} in ${r.careerFieldName}: fitness = ${r.fitnessScore.toFixed(2)}`);
  });

  return recommendations.sort((a, b) => b.fitnessScore - a.fitnessScore);
  
}

module.exports = {
  initializeUserSkills,
  calculateCareerFitness,
  recommendCareers
};
