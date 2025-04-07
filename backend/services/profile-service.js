// this is the service for managing user (student) profiles and authentication
// TODO revise and rewrite later!!!
class ProfileService {
  // creating a new profile service instance
  constructor(userDAO, profileDAO, academicDAO) {
    this.userDAO = userDAO;
    this.profileDAO = profileDAO;
    this.academicDAO = academicDAO;
  }

  // authenticating a user by email and password
  async authenticateUser(email, password) {
    try {
      // getting user by email
      const user = await this.userDAO.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // verifying password (this is a simplified example)
      if (user.passwordHash !== password) {
        throw new Error('Invalid password');
      }

      // getting profile data
      const profile = await this.profileDAO.getProfileByUserId(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        profile
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
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
        }
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
