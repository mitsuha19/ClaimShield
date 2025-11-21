const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = { id: user.id, role: user.role };
    next();
  });
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Role '${req.user.role}' not authorized for this action`,
    });
  }
  next();
};

module.exports = { authenticateToken, checkRole };
