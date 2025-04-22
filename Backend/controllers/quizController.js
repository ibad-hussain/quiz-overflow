import userModel from "../models/userModel.js";
import quizModel from "../models/quizModel.js";



// Function to Fetch quiz
export const getQuiz = async (req, res) => {

    try {

        const { quizId } = req.params;

        const quiz = await quizModel.findById(quizId);
        if (!quiz) {
            return res.status(400).json({ success: false, message: "Quiz not found" });
        }

        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const alreadyAttempted = user.quizzesTaken.some(
            (entry) => entry.quizId.toString() === quizId
        );

        if (alreadyAttempted) {
            return res.status(400).json({ success: false, message: "You've already attempted this quiz" });
        }

        res.status(200).json({
            success: true,
            message: "Quiz sent successfully",
            quiz: {
                title: quiz.title,
                category: quiz.category,
                level: quiz.level,
                mode: quiz.mode,
                questions: quiz.questions,
                questionsCount: quiz.questionsCount,
                scoreForBadge: quiz.scoreForBadge
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending quiz" });
    }

};



// Function to Submit quiz
export const submitQuiz = async (req, res) => {

    try {

        const { quizId } = req.params;
        const { selectedQuestions, userAnswers } = req.body;

        const quiz = await quizModel.findById(quizId);

        if (!quiz) {
            return res.status(400).json({ success: false, message: "Quiz not found" });
        }

        // Score Calculation
        let score = 0;
        const results = selectedQuestions.map((q) => {
            const userAnswer = userAnswers[q._id];
            const correctAnswer = q.correctAnswer;
            if (userAnswer === correctAnswer) score++;

            return {
                questionText: q.questionText,
                options: q.options,
                correctAnswer,
                userAnswer: userAnswer || null
            };
        });

        const badgeEarned = score >= quiz.scoreForBadge;

        // Save progress in user
        const user = await userModel.findById(req.userId);
        user.quizzesTaken.push({
            quizId: quiz._id,
            title: quiz.title,
            category: quiz.category,
            level: quiz.level,
            mode: quiz.mode,
            questionsCount: quiz.questionsCount,
            score,
            badgeEarned
        });
        await user.save();

        res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            score,
            badgeEarned,
            results
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error submitting quiz" });
    }

};



// Function to get all Quiz titles
export const getAllQuizTitles = async (req, res) => {

    try {

        const titles = await quizModel.distinct("title");  // get unique titles
        res.status(200).json({
            success: true,
            message: "All Quiz titles sent successfully",
            titles
        });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending all quiz titles" });
    }

};



// Funtion to get all Quizzes
export const getAllQuizzes = async (req, res) => {

    try {

        const quizzes = await quizModel.find();
        res.status(200).json({
            success: true,
            message: "All Quizzes sent successfully",
            quizzes
        });

    } catch (error) {
        res.status(500).json({ message: "Error sending all quizzes" });
    }

};



// Function to get all quizzes by title
export const getQuizzesByTitles = async (req, res) => {

    const { title } = req.params;

    try {

        const quizzes = await quizModel.find({ title });
        res.status(200).json({
            success: true,
            message: "All Quizzes by title sent successfully",
            quizzes
        });

    } catch (error) {
        res.status(500).json({ message: "Error sending all quizzes by title" });
    }

};



// Function to get total number of badges earned by a user
export const getBadgesCount = async (req, res) => {

    try {

        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const quizIds = user.quizzesTaken.map((entry) => entry.quizId);
        const quizzes = await quizModel.find({ _id: { $in: quizIds } });
        const quizMap = {};

        quizzes.forEach((quiz) => {
            quizMap[quiz._id.toString()] = quiz;
        });

        let badgesCount = 0;

        user.quizzesTaken.forEach((attempt) => {
            const quiz = quizMap[attempt.quizId.toString()];
            if (quiz && attempt.score >= quiz.scoreForBadge) {
                badgesCount++;
            }
        });

        res.status(200).json({
            success: true,
            message: "Total number of badges sent successfully",
            badgesCount
        });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending total number of badges" });
    }

};
