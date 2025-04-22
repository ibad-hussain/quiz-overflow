import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';



// Function to authenticate admin
const adminAuth = async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ success: false, message: "Not authorized. Login again" });
  }

  try {

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(tokenDecode.id);
    if (!user || user.role !== 'admin') {
      return res.status(400).json({ success: false, message: "Access denied" });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "Token expired. Please log in again" });
    }
    return res.status(500).json({ success: false, message: "Error authenticating" });
  }

};

export default adminAuth;
