// this is the service for managing user (student) profiles
class ProfileService {
  // creating a new profile service instance
  constructor(userDAO, profileDAO, academicDAO, tutorDAO) {
    this.userDAO = userDAO;
    this.profileDAO = profileDAO;
    this.academicDAO = academicDAO;
    this.tutorDAO = tutorDAO;
  }


  // getting complete profile information + academic data
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
}

module.exports = ProfileService;
