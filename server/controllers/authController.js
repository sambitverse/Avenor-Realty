import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const token = generateAccessToken({ id: `user-${Date.now()}`, email, role: role || 'User' });
  const refreshToken = generateRefreshToken({ id: `user-${Date.now()}` });

  return res.status(201).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role: role || 'User'
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const isAdmin = email && email.toLowerCase().includes('admin');
  const role = isAdmin ? 'Admin' : 'User';

  const token = generateAccessToken({ id: isAdmin ? 'admin-001' : 'user-001', email, role });
  const refreshToken = generateRefreshToken({ id: isAdmin ? 'admin-001' : 'user-001' });

  return res.status(200).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: isAdmin ? 'admin-001' : 'user-001',
      name: isAdmin ? 'Avenor Executive Lead' : (email ? email.split('@')[0] : 'Alexander Wright'),
      email: email || 'investor@avenor.com',
      role,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  });
};

export const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
