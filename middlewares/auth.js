const jwt = require("jsonwebtoken");
exports.verify = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });
  next();
};
