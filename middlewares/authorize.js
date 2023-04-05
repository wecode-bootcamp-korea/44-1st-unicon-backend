const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'unauthorized' });
    }
  
    try { 
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.userId;
      
      next();
    } catch (err) {
      return res.status(401).json({ message: 'unauthorized' });
    }
  };


module.exports = { authorize }