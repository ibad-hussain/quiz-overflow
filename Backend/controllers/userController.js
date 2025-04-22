import userModel from "../models/userModel.js";
import quizModel from '../models/quizModel.js';
import bcrypt from "bcryptjs";



// Function to get user data
export const getUserData = async (req, res) => {

    try {

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User data sent successfully",
            userData: {
                name: user.name,
                email: user.email,
                role: user.role,
                developerId: user.developerId,
                avatar: user.avatar,
                linkedinLink: user.linkedinLink || '',
                githubLink: user.githubLink || '',
                quizzesTaken: user.quizzesTaken
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending user data" });
    }

};



// Function to Update user profile
export const updateUserProfile = async (req, res) => {

    try {

        const { name, password, linkedinLink, githubLink } = req.body;

        let user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Update fields if provided
        if (name) {
            user.name = name;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (linkedinLink !== undefined) {
            user.linkedinLink = linkedinLink;
        }
        if (githubLink !== undefined) {
            user.githubLink = githubLink;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user profile" });
    }

};



// Function to Share user profile
export const shareProfile = async (req, res) => {

    try {

        const { developerId } = req.params;

        const user = await userModel.findOne({ developerId });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const quizIds = user.quizzesTaken.map((entry) => entry.quizId);
        const quizzes = await quizModel.find({ _id: { $in: quizIds } });
        const quizMap = {};

        quizzes.forEach((quiz) => {
            quizMap[quiz._id.toString()] = quiz;
        });

        const badgesList = [];

        user.quizzesTaken.forEach((attempt) => {
            const quiz = quizMap[attempt.quizId.toString()];
            if (quiz && attempt.score >= quiz.scoreForBadge) {
                badgesList.push({
                    title: quiz.title,
                    category: quiz.category,
                    level: quiz.level,
                    mode: quiz.mode,
                    questionsCount: quiz.questionsCount,
                    scoreForBadge: quiz.scoreForBadge
                });
            }
        });

        res.status(200).json({
            success: true,
            message: "User profile sent successfully (to share)",
            userData: {
                name: user.name,
                developerId: user.developerId,
                avatar: user.avatar,
                linkedinLink: user.linkedinLink,
                githubLink: user.githubLink,
                badgesList
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending user profile (to share)" });
    }

};



// Function to Delete user profile
export const deleteUserProfile = async (req, res) => {

    try {

        const { developerId } = req.body;

        let user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (!developerId) {
            return res.status(400).json({ success: false, message: "Developer ID is required" });
        }

        // Ensure the logged-in user is deleting their own account
        if (user.developerId !== developerId) {
            return res.status(400).json({ success: false, message: "Unauthorized action" });
        }

        await userModel.deleteOne({ developerId });

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.status(200).json({ success: true, message: "Account deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting account" });
    }

};



// Function to get total number and list of badges earned by a user
export const getBadgesCountAndList = async (req, res) => {

    try {

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const quizIds = user.quizzesTaken.map((entry) => entry.quizId);
        const quizzes = await quizModel.find({ _id: { $in: quizIds } });
        const quizMap = {};

        quizzes.forEach((quiz) => {
            quizMap[quiz._id.toString()] = quiz;
        });

        let badgesCount = 0;
        let badgesList = [];

        user.quizzesTaken.forEach((attempt) => {
            const quiz = quizMap[attempt.quizId.toString()];
            if (quiz && attempt.score >= quiz.scoreForBadge) {
                badgesCount++;
                badgesList.push(
                    quiz.title,
                    quiz.category,
                    quiz.level,
                    quiz.mode,
                    quiz.questionsCount,
                    quiz.scoreForBadge
                );
            }
        });

        res.status(200).json({
            success: true,
            message: "Total number and list of badges sent successfully",
            badgesCount,
            badgesList
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending total number and list of badges" });
    }

};
