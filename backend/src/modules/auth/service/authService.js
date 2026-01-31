import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../../models/index.js';

class AuthService {
  async register(email, password) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw {
        status: 409,
        message: 'Email already registered',
      };
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user with SUPER_ADMIN role
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
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
