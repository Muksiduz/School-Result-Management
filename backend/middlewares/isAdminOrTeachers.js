export function isAdminOrTeacher(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}
