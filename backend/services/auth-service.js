// this is the service for managing user authentication and authorization 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  // creating a new auth service instance
  constructor(userDAO, authDAO) {
    this.userDAO = userDAO;
    this.authDAO = authDAO;
    this.secretKey = process.env.JWT_SECRET || 'supersecretkey';
    this.tokenExpiration = '24h';
  }

  // registering a new user
  async registerUser(userData) {
    try {
      // extracting and hashing password
      const { password, ...userInfo } = userData;
      
      // validating required fields
      if (!userInfo.id || !userInfo.email || !userInfo.role) {
        throw new Error('Missing required user information');
      }
      
      // hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // creating user with hashed password
      const user = await this.authDAO.createUser({
        ...userInfo,
        passwordhash: hashedPassword
      });
      
      // returning user without password hash
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Error registering user');
    }
  }

  // authenticating a user and generating JWT token
  async authenticateUser(email, password) {
    try {
      // finding user by email
      const user = await this.authDAO.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // verifying password
      const validPassword = await bcrypt.compare(password, user.passwordhash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }
      
      // preparing user data without password
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      // generating JWT token
      const token = this.generateToken(userData);
      
      return {
        user: userData,
        token: token
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // generating a JWT token for authenticated user
  generateToken(user) {
    return jwt.sign(user, this.secretKey, { expiresIn: this.tokenExpiration });
  }

  // verifying a JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService;
