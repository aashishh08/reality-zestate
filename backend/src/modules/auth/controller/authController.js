import authService from '../service/authService.js';

class AuthController {
  async register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw {
        status: 400,
        message: 'Email and password are required',
      };
    }

    if (password.length < 6) {
      throw {
        status: 400,
        message: 'Password must be at least 6 characters',
      };
    }

    const result = await authService.register(email, password);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Admin registered successfully',
    });
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw {
        status: 400,
        message: 'Email and password are required',
      };
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  }
}

export default new AuthController();
