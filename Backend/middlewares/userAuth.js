import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'



// Function to authenticate user
const userAuth = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(tokenDecode.id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User no longer exists. Sign up again" });
        }

        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
            next();
        } else {
            return res.status(400).json({ success: false, message: "Unauthorized action" });
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ success: false, message: "Token expired. Please log in again" });
        }
        res.status(500).json({ success: false, message: "Error authenticating" });
    }

};

export default userAuth;
