// this is the service for managing user authentication and authorization 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // путь к pool

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
      const user = await this.authDAO.getUserByEmail(email);
      if (!user) throw new Error('Invalid credentials');
  
      const validPassword = await bcrypt.compare(password, user.passwordhash);
      if (!validPassword) throw new Error('Invalid credentials');
  
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role
      };
  
      const token = this.generateToken(userData);
  
      // ───────────── Профиль по умолчанию ─────────────
      const userName = user.id.toLowerCase().replace(/\s+/g, '_');
      const profileId = `profile_${userName}`;
      const degreeId = user.studies

      // проверка наличия профиля
      const checkQuery = `SELECT 1 FROM "Profile" WHERE userid = $1`;
      const existing = await pool.query(checkQuery, [user.id]);

      if (existing.rowCount === 0) {
        // только если у студента есть degreeId
        if (user.role === 'STUDENT' && user.studies) {
          await pool.query(`
            INSERT INTO "Profile" 
            (id, userid, firstname, lastname, degreeid, graduationyear, bio)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            profileId,
            user.id,
            user.id,
            'Doe',
            user.studies,
            2026,
            'Auto-generated profile'
          ]);
      
          console.log(`🟢 Profile created for student ${user.id}`);
        } else if (user.role === 'TECAHER') {
          await pool.query(`
            INSERT INTO "Profile" 
            (id, userid, firstname, lastname, graduationyear, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            profileId,
            user.id,
            user.id,
            'Doe',
            2026,
            'Auto-generated profile (teacher)'
          ]);
      
          
        }
      }
      
  
      return { user: userData, token };
  
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

  // forgot password functionality -- SIMULATION, REVIEW LATER
  async generatePasswordResetToken(email) {
    try {
      // finding user by email
      const user = await this.authDAO.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      
      // generating a reset token
      const resetToken = jwt.sign(
        { id: user.id, email: user.email, purpose: 'password_reset' },
        this.secretKey,
        { expiresIn: '1h' } // short expiration for security
      );
      
      // In a real implementation, store the token in the database
      // along with the user ID and expiration time
      
      return resetToken;
    } catch (error) {
      console.error('Error generating reset token:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // verifying token
      let decoded;
      try {
        decoded = jwt.verify(token, this.secretKey);
      } catch (error) {
        throw new Error('Invalid or expired token');
      }
      
      // checking token purpose
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      
      // finding user
      const user = await this.userDAO.getUserById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // hashing new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // updating user password in the database
      await this.userDAO.updateUser(user.id, { passwordhash: hashedPassword });
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
