exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

exports.isSeller = (req, res, next) => {
  if (req.user?.role !== "seller" && req.user?.status !== "registered") {
    return res.status(403).json({ message: "Access denied: Seller only" });
  }
  next();
};

exports.isBuyer = (req, res, next) => {
  if (req.user?.role !== "buyer" && req.user?.status !== "registered") {
    return res.status(403).json({ message: "Access denied: Buyer only" });
  }
  next();
};
