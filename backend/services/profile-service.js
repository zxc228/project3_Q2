// this is the service for managing user (student) profiles
class ProfileService {
  // creating a new profile service instance
  constructor(userDAO, profileDAO, academicDAO, tutorDAO) {
    this.userDAO = userDAO;
    this.profileDAO = profileDAO;
    this.academicDAO = academicDAO;
    this.tutorDAO = tutorDAO;
  }


  // getting complete profile information + academic data (from the database Profile table)
  async getCompleteProfile(profileId) {
    try {
      // getting base profile data
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // getting user data
      const user = await this.userDAO.getUserById(profile.userId);

      // getting degree information
      let degree = null;
      if (profile.degreeId) {
        degree = await this.academicDAO.getDegreeById(profile.degreeId);
      }

      // getting subjects for this degree
      let subjects = [];
      if (degree) {
        subjects = await this.academicDAO.getSubjectsByDegreeId(degree.id);
      }

      // getting grades for this profile
      const grades = await this.profileDAO.getStudentGrades(profileId);

      // getting tutor information if assigned
      let tutor = null;
      if (profile.tutorId) {
        tutor = await this.tutorDAO.getTutorById(profile.tutorId);
      }

      return {
        profile,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        academic: {
          degree,
          subjects,
          grades
        },
        tutor: tutor ? {
          id: tutor.id,
          firstName: tutor.firstName,
          lastName: tutor.lastName
        } : null
      };
    } catch (error) {
      console.error('Error getting complete profile:', error);
      throw new Error('Failed to retrieve profile information');
    }
  }

  // updating profile information
  async updateProfile(profileId, profileData) {
    try {
      // validating profile exists
      const existingProfile = await this.profileDAO.getProfileById(profileId);
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      // validating degree if included
      if (profileData.degreeId) {
        const degree = await this.academicDAO.getDegreeById(profileData.degreeId);
        if (!degree) {
          throw new Error('Invalid degree selected');
        }
      }

      // updating profile
      const updatedProfile = await this.profileDAO.updateProfile(profileId, profileData);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // getting complete profile information + academic data + skills (from several the database tables, to be used for student profiles on frontend)
  async getCompleteProfileWithSkills(profileId) {
    try {
      // getting base profile and academic data
      const profileData = await this.getCompleteProfile(profileId);
      if (!profileData) {
        throw new Error('Profile not found');
      }

      // getting skills data
      const skills = await this.skillsDAO.getProfileSkills(profileId);
      
      // getting completed credits
      const completedCredits = await this.profileDAO.getCompletedCredits(profileId);

      // combining data
      return {
        ...profileData,
        skills,
        completedCredits
      };
    } catch (error) {
      console.error('Error getting complete profile with skills:', error);
      throw error;
    }
  }

  // adding several courses to student profile (to be used with Senen's Expediente Academico parser)
  async addCoursesToProfile(profileId, courses) {
    try {
      // validating profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // validating courses
      for (const course of courses) {
        if (!course.subjectId) {
          throw new Error('Each course must have a subjectId');
        }
        
        // checking if subject exists
        const subject = await this.academicDAO.getSubjectById(course.subjectId);
        if (!subject) {
          throw new Error(`Invalid subject: ${course.subjectId}`);
        }
      }

      // adding each course as a grade record with zero grade
      const addedGrades = [];
      
      for (const course of courses) {
        // checking if student already has this subject
        const existingGrade = await this.profileDAO.getStudentGradeBySubjectId(
          profileId, 
          course.subjectId
        );
        
        if (!existingGrade) {
          // creating new grade record with IN_PROGRESS status
          const gradeData = {
            id: `grade_${profileId}_${course.subjectId}`,
            profileId,
            subjectId: course.subjectId,
            grade: 0,
            status: 'IN_PROGRESS'
          };
          
          const grade = await this.profileDAO.createGrade(gradeData);
          addedGrades.push(grade);
        }
      }

      return addedGrades;
    } catch (error) {
      console.error('Error adding courses to profile:', error);
      throw error;
    }
  }

  // adding grades to profile (to be used AFTER all the courses are added)
  async addGradesToProfile(profileId, grades) {
    try {
      // validating profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // validating grades
      for (const grade of grades) {
        if (!grade.subjectId || grade.grade === undefined) {
          throw new Error('Each grade must have subjectId and grade value');
        }
        
        // checking if subject exists
        const subject = await this.academicDAO.getSubjectById(grade.subjectId);
        if (!subject) {
          throw new Error(`Invalid subject: ${grade.subjectId}`);
        }
        
        // validating grade value (assuming 0-10 scale)
        if (grade.grade < 0 || grade.grade > 10) {
          throw new Error(`Invalid grade value for ${grade.subjectId}: ${grade.grade}`);
        }
      }

      // updating or creating grades
      const updatedGrades = [];
      
      for (const gradeData of grades) {
        // checking if student already has this subject
        const existingGrade = await this.profileDAO.getStudentGradeBySubjectId(
          profileId, 
          gradeData.subjectId
        );
        
        // setting status based on grade value (pass threshold is 5.0)
        const status = gradeData.grade >= 5.0 ? 'COMPLETED' : 'IN_PROGRESS';
        
        if (existingGrade) {
          // updating existing grade (almost never to be used, I guess)
          const updatedGrade = await this.profileDAO.updateGrade(
            existingGrade.id, 
            { 
              grade: gradeData.grade,
              status: gradeData.status || status
            }
          );
          updatedGrades.push(updatedGrade);
        } else {
          // creating new grade
          const newGradeData = {
            id: `grade_${profileId}_${gradeData.subjectId}`,
            profileId,
            subjectId: gradeData.subjectId,
            grade: gradeData.grade,
            status: gradeData.status || status
          };
          
          const newGrade = await this.profileDAO.createGrade(newGradeData);
          updatedGrades.push(newGrade);
        }
      }

      return updatedGrades;
    } catch (error) {
      console.error('Error adding grades to profile:', error);
      throw error;
    }
  }

  // checking user permissions before accessing any file
  async getProfileIdByFilePath(filePath) {
    try {
      return this.profileDAO.getProfileIdByFilePath(filePath);
    } catch (error) {
      console.error('Error finding profile by file path:', error);
      throw error;
    }
  }

  // by userId and profileId, checks that this is the User and the Profile of the same person
  async isUserProfile(userId, profileId) {
    try {
      const profile = await this.profileDAO.getProfileById(profileId);
      return profile && profile.userId === userId;
    } catch (error) {
      console.error('Error checking profile ownership:', error);
      throw error;
    }
  }
}

module.exports = ProfileService;
