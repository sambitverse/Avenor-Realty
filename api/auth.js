export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { email, password, action } = req.body || {};
    if (action === 'login') {
      return res.status(200).json({
        success: true,
        token: `jwt_avenor_${Date.now()}`,
        user: {
          id: 'user-001',
          name: email ? email.split('@')[0] : 'Luxury Investor',
          email: email || 'investor@avenor.com',
          role: email?.includes('admin') ? 'admin' : 'user'
        }
      });
    }
    if (action === 'register') {
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: `user-${Date.now()}`,
          email,
          role: 'user'
        }
      });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
