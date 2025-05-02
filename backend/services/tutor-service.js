// this is the service for managing tutor profiles and student-tutor relationships
class TutorService {
  constructor(tutorDAO, profileDAO, userDAO, academicDAO) {
    this.tutorDAO = tutorDAO;
    this.profileDAO = profileDAO;
    this.userDAO = userDAO;
    this.academicDAO = academicDAO;
  }

  async getAllTutors() {
    try {
      return this.tutorDAO.getTutors();
    } catch (error) {
      console.error('Error getting tutors:', error);
      throw new Error('Failed to retrieve tutors');
    }
  }

  async getTutorById(tutorId) {
    try {
      // getting tutor profile
      const tutor = await this.tutorDAO.getTutorById(tutorId);
      if (!tutor) {
        throw new Error('Tutor not found');
      }

      // getting user information for email
      const user = await this.userDAO.getUserById(tutor.userId);
      
      return {
        ...tutor,
        email: user.email
      };
    } catch (error) {
      console.error('Error getting tutor:', error);
      throw error;
    }
  }

  async createTutor(tutorData) {
    try {
      // validating user exists
      const user = await this.userDAO.getUserById(tutorData.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // creating tutor
      const tutor = await this.tutorDAO.createTutor(tutorData);
      
      return tutor;
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  async updateTutor(tutorId, tutorData) {
    try {
      // checking if tutor exists
      const existingTutor = await this.tutorDAO.getTutorById(tutorId);
      if (!existingTutor) {
        throw new Error('Tutor not found');
      }
      
      // updating tutor
      const updatedTutor = await this.tutorDAO.updateTutor(tutorId, tutorData);
      
      return updatedTutor;
    } catch (error) {
      console.error('Error updating tutor:', error);
      throw error;
    }
  }

  // getting students assigned to a tutor
  async getTutorStudents(tutorId) {
    try {
      // checking if tutor exists
      const tutor = await this.tutorDAO.getTutorById(tutorId);
      if (!tutor) {
        throw new Error('Tutor not found');
      }
      
      // getting students assigned to this tutor
      const students = await this.tutorDAO.getStudentsByTutorId(tutorId);
      
      // enriching with degree information and email
      const enrichedStudents = await Promise.all(students.map(async (student) => {
        const user = await this.userDAO.getUserById(student.userId);
        let degree = null;
        if (student.degreeId) {
          degree = await this.academicDAO.getDegreeById(student.degreeId);
        }
        
        return {
          ...student,
          email: user.email,
          degree: degree ? {
            id: degree.id,
            name: degree.name
          } : null
        };
      }));
      
      return enrichedStudents;
    } catch (error) {
      console.error('Error getting tutor students:', error);
      throw error;
    }
  }

  async assignTutorToStudent(profileId, tutorId) {
    try {
      // checking if profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // checking if tutor exists
      const tutor = await this.tutorDAO.getTutorById(tutorId);
      if (!tutor) {
        throw new Error('Tutor not found');
      }
      
      // updating profile with tutor id
      const updatedProfile = await this.profileDAO.updateProfile(profileId, { tutorId });
      
      return {
        ...updatedProfile,
        tutor: {
          id: tutor.id,
          firstName: tutor.firstName,
          lastName: tutor.lastName
        }
      };
    } catch (error) {
      console.error('Error assigning tutor:', error);
      throw error;
    }
  }

  // getting the tutor assigned to a student
  async getStudentTutor(profileId) {
    try {
      // checking if profile exists
      const profile = await this.profileDAO.getProfileById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // checking if profile has a tutor
      if (!profile.tutorId) {
        throw new Error('No tutor assigned to this student');
      }
      
      // getting tutor details
      return this.getTutorById(profile.tutorId);
    } catch (error) {
      console.error('Error getting student tutor:', error);
      throw error;
    }
  }

  // searching a student by a substring of the name or the surname
  async searchStudentsByName(searchTerm) {
    try {
      // getting students matching search term
      const students = await this.tutorDAO.searchStudentsByName(searchTerm);
      
      // enriching with degree information
      const enrichedStudents = await Promise.all(students.map(async (student) => {
        let degree = null;
        if (student.degreeId) {
          degree = await this.academicDAO.getDegreeById(student.degreeId);
        }
        
        return {
          ...student,
          degree: degree ? {
            id: degree.id,
            name: degree.name
          } : null
        };
      }));
      
      return enrichedStudents;
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  // by userId of the tutor and profileId of a student, checking that this tutor is assigned to this tutor. to be used mainly in the file access functionality
  async isTutorForStudent(userId, profileId) {
    try {
      // getting tutor by user id
      const tutor = await this.tutorDAO.getTutorByUserId(userId);
      if (!tutor) {
        return false;
      }
      
      // checking if this tutor is assigned to the student
      const profile = await this.profileDAO.getProfileById(profileId);
      return profile && profile.tutorId === tutor.id;
    } catch (error) {
      console.error('Error checking tutor relationship:', error);
      throw error;
    }
  }
}

module.exports = TutorService;
