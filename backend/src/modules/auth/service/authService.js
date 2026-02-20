import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../../models/index.js';

class AuthService {
  async register(email, password, role = 'VIEWER') {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw {
        status: 409,
        message: 'Email already registered',
      };
    }

    // Validate role
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'];
    if (!validRoles.includes(role)) {
      throw {
        status: 400,
        message: 'Invalid role. Must be one of: ' + validRoles.join(', '),
      };
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw {
        status: 401,
        message: 'Invalid email or password',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: 'Invalid email or password',
      };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

export default new AuthService();
