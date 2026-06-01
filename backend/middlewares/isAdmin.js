export async function isAdmin(req, res, next){
    if(req.user.role !== "admin") {
        return res.status(401).json({ message: "You are not an admin" });
    }
    next();
}