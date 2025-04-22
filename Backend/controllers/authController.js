import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sendWelcomeEmail from "../config/mailer.js";



// Function to generate unique developerId
export const generateDeveloperId = async () => {

    let isUnique = false;
    let developerId;
    let retries = 0;
    const maxRetries = 100;  // Limit retries to prevent infinite loop

    while (!isUnique && retries < maxRetries) {
        const randomId = "QOF" + Math.floor(1000 + Math.random() * 9000);
        const existingUser = await userModel.findOne({ developerId: randomId });

        if (!existingUser) {
            developerId = randomId;
            isUnique = true;
        }

        retries++;
    }

    // If retries exceed the limit, throw an error
    if (retries === maxRetries) {
        throw new Error("Unable to generate unique developerId after several attempts");
    }

    return developerId;
};



// Function to Register user
export const register = async (req, res) => {

    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const developerId = await generateDeveloperId();

        let avatar = "maleAvatar.jpg";
        if (gender.toLowerCase() === "female") {
            avatar = "femaleAvatar.jpg";
        }

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            gender,
            developerId,
            avatar,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await sendWelcomeEmail(user.email, user.name, user.avatar);

        return res.status(200).json({ success: true, message: "Account created successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering user" });
    }

};



// Function to Login user
export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: "Login successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in user" });
    }

};



// Function to Logout user
export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.status(200).json({ success: true, message: 'Log out successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging out user" });
    }

};

