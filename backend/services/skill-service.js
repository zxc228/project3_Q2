const { initializeUserSkills } = require('../logic/career-recommendation-logic');

// this is the service for managing user skills and skill assessments

class SkillService {
  // creating a new skill service instance
  constructor(profileDAO, skillsDAO, academicDAO) {
    this.profileDAO = profileDAO;
    this.skillsDAO = skillsDAO;
    this.academicDAO = academicDAO;
  }

  // initializing skills for a user based on their grades using a function defined in 'logic' layer
  async initializeSkillsForProfile(profileId) {
    try {
      // getting profile to validate
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // getting all required data
      const grades = await this.profileDAO.getStudentGrades(profileId);
      const allSkills = await this.skillsDAO.getSkills();
      const skillMaps = await this.skillsDAO.getSkillMaps();

      // calculating initial skill levels
      const initializedSkills = initializeUserSkills(grades, skillMaps, allSkills);

      // updating or creating profile skills in database
      for (const skill of initializedSkills) {
        // checking if skill already exists for this profile
        const existingSkill = await this.skillsDAO.getProfileSkillByIds(
          profileId,
          skill.skillId
        );

        if (existingSkill) {
          // updating if exists
          await this.skillsDAO.updateProfileSkill(
            existingSkill.id,
            { skillLevel: skill.currentLevel }
          );
        } else {
          // creating if not exists
          await this.skillsDAO.createProfileSkill({
            profileId,
            skillId: skill.skillId,
            skillLevel: skill.currentLevel
          });
        }
      }

      // getting the full profile skill records with names
      return this.getProfileSkills(profileId);
    } catch (error) {
      console.error('Error initializing skills:', error);
      throw new Error('Failed to initialize profile skills');
    }
  }

  // getting all skills for a profile
  async getProfileSkills(profileId) {
    try {
      // validating profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // getting skills with joined skill information
      return this.skillsDAO.getProfileSkills(profileId);
    } catch (error) {
      console.error('Error getting profile skills:', error);
      throw new Error('Failed to retrieve profile skills');
    }
  }

  // updating a single skill level for a profile (to be used in self-assessment)
  async updateProfileSkill(profileId, skillId, skillLevel) {
    try {
      // validating skill level
      if (skillLevel < 0 || skillLevel > 5) {
        throw new Error('Skill level must be between 0 and 5');
      }

      // getting existing profile skill
      const existingSkill = await this.skillsDAO.getProfileSkillByIds(profileId, skillId);
      if (!existingSkill) {
        throw new Error('Profile skill not found');
      }

      // updating the skill
      return this.skillsDAO.updateProfileSkill(existingSkill.id, { skillLevel });
    } catch (error) {
      console.error('Error updating profile skill:', error);
      throw new Error('Failed to update profile skill');
    }
  }

  // updating multiple skills at once (also for self-assessment)
   
  async updateProfileSkills(profileId, skills) {
    try {
      // validate profile
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // get current profile skills
      const currentSkills = await this.skillsDAO.getProfileSkills(profileId);
      const skillMap = new Map();
      currentSkills.forEach(skill => {
        skillMap.set(skill.skillId, skill);
      });

      const updates = [];

      for (const raw of skills) {
        // фронт может прислать { id, current } или { skillId, skillLevel }
        const skillId     = raw.skillId  || raw.id;
        const skillLevel  = raw.skillLevel ?? raw.current;
      
        if (!skillId) continue;               // защита от мусора
        if (skillLevel < 0 || skillLevel > 5) {
          throw new Error(`Skill level for ${skillId} must be between 0 and 5`);
        }
      
        const existing = skillMap.get(skillId);
      
        if (existing) {
          updates.push({ id: existing.id, skillLevel });
        } else {
          const generatedId = `ps_${profileId}_${skillId}`;
          await this.skillsDAO.createProfileSkill({
            id: generatedId,
            profileId,
            skillId,
            skillLevel
          });
        }
      }
      

      // bulk update
      if (updates.length > 0) {
        await this.skillsDAO.bulkUpdateProfileSkills(updates);
      }

      return this.getProfileSkills(profileId);
    } catch (error) {
      console.error('Error updating profile skills:', error);
      throw new Error('Failed to update profile skills');
    }
  }


  // getting all available skills in the system
  async getAllSkills() {
    try {
      return this.skillsDAO.getSkills();
    } catch (error) {
      console.error('Error getting all skills:', error);
      throw new Error('Failed to retrieve skills');
    }
  }
}

module.exports = SkillService;
