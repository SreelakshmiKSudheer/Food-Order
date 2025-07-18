exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

exports.isBuyer = (req, res, next) => {
  if (req.user?.role !== "buyer") {
    return res.status(403).json({ message: "Access denied: Buyer only" });
  }
  next();
};
