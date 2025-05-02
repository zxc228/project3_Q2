const BaseDAO = require('./base-dao');

class SkillsDAO extends BaseDAO {
  async getSkills() {
    return this.findAll('Skill');
  }

  async getSkillById(id) {
    return this.findById('Skill', id);
  }

  async getSkillMaps() {
    return this.findAll('SkillMap');
  }

  async getSkillMapsBySubjectId(subjectId) {
    return this.findByField('SkillMap', 'subjectId', subjectId);
  }

  async getProfileSkills(profileId) {
    const query = `
      SELECT ps.*, s.name as skillName, s.description as skillDescription
      FROM "ProfileSkill" ps
      JOIN "Skill" s ON ps.skillId = s.id
      WHERE ps.profileId = $1
    `;
    
    return this.query(query, [profileId]);
  }

  async getProfileSkillByIds(profileId, skillId) {
    const query = `
      SELECT ps.*, s.name as skillName, s.description as skillDescription
      FROM "ProfileSkill" ps
      JOIN "Skill" s ON ps.skillId = s.id
      WHERE ps.profileId = $1 AND ps.skillId = $2
    `;
    
    const result = await this.query(query, [profileId, skillId]);
    return result.length ? result[0] : null;
  }

  async createProfileSkill(profileSkillData) {
    const { profileId, skillId, skillLevel } = profileSkillData;
  
    const id = `ps_${profileId}_${skillId}`;
    const updatedAt = new Date().toISOString();
  
    const rows = await this.query(
      `INSERT INTO "ProfileSkill"(id, profileId, skillId, skillLevel, updatedAt)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id)
       DO UPDATE
       SET skillLevel = EXCLUDED.skillLevel,
           updatedAt  = EXCLUDED.updatedAt
       RETURNING *`,
      [id, profileId, skillId, skillLevel, updatedAt]
    );
  
    return rows[0];
  }
  

  async updateProfileSkill(id, profileSkillData) {
    return this.update('ProfileSkill', id, profileSkillData);
  }

  async bulkUpdateProfileSkills(profileSkills) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const skill of profileSkills) {
        const { id, skillLevel } = skill;
        
        if (!id) continue;
        
        await client.query(
          `UPDATE "ProfileSkill" SET "skillLevel" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2`,
          [skillLevel, id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Bulk update error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = SkillsDAO;
