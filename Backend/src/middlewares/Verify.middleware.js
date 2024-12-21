import jwt from "jsonwebtoken"

const verifyToken = (req,res,next) =>{
  const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log("token not found");
      
        return res.status(401).json({ message: "No token provided" }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        req.userId = decoded.userId; 
        next(); 
      } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" }); 
      }
}

export default verifyToken