import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];  // if authHeader is not present than its falsy, so it will return undefined and if its has value then it will return the token

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}