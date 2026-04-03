import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and other payload data
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed. Invalid or expired token.' });
  }
};

export default auth;
