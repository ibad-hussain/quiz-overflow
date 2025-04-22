import userModel from '../models/userModel.js';
import quizModel from '../models/quizModel.js';
import contactModel from '../models/contactModel.js';



// Unified Admin Dashboard Route
// - Total number of users (`userCount`)
// - All users with populated `quizzesTaken.quizId` field (`users`)
// - All quizzes (`quizzes`)
// - Number of quizzes attempted per user (`quizzesPerUser`)
// - Total number of attempts per quiz (`quizAttempts`)
// - Number of badges earned per quiz (based on `score >= scoreForBadge`) grouped by title+category+level (`badgeStats`)

export const getAdminDashboardData = async (req, res) => {

  try {

    const [userCount, users, quizzes, quizzesPerUser, quizAttempts, badgeStats] = await Promise.all([

      // Count total number of registered users
      userModel.countDocuments(),

      // Get all users and populate the quiz details for each quiz they've taken
      userModel.find().populate({
        path: 'quizzesTaken.quizId',
        model: 'quiz'
      }),

      // Get all quizzes
      quizModel.find(),

      // Aggregate: total number of quizzes taken by each user
      userModel.aggregate([
        { $unwind: "$quizzesTaken" },
        {
          $group: {
            _id: "$developerId",
            totalQuizzes: { $sum: 1 }
          }
        }
      ]),

      // Aggregate: total number of attempts per quiz, with quiz title included
      userModel.aggregate([
        { $unwind: "$quizzesTaken" },
        {
          $group: {
            _id: "$quizzesTaken.quizId",
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "quizzes",
            localField: "_id",
            foreignField: "_id",
            as: "quizDetails"
          }
        },
        { $unwind: "$quizDetails" },
        {
          $project: {
            _id: 0,
            quizId: "$quizDetails._id",
            title: "$quizDetails.title",
            count: 1
          }
        }
      ]),

      // Aggregate: number of badges earned per quiz (title+category+level), where score is greater than or equal to scoreForBadge
      userModel.aggregate([
        { $unwind: "$quizzesTaken" },
        {
          $lookup: {
            from: "quizzes",
            localField: "quizzesTaken.quizId",
            foreignField: "_id",
            as: "quizInfo"
          }
        },
        { $unwind: "$quizInfo" },
        {
          $match: {
            $expr: { $gte: ["$quizzesTaken.score", "$quizInfo.scoreForBadge"] }
          }
        },
        {
          $group: {
            _id: {
              title: "$quizInfo.title",
              category: "$quizInfo.category",
              level: "$quizInfo.level"
            },
            badgesEarned: { $sum: 1 }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      message: "Users and Quizzes details for Admin sent successfully",
      data: {
        userCount,
        users,
        quizzes,
        quizzesPerUser,
        quizAttempts,
        badgeStats
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending all Users and Quizzes details to Admin" });
  }

};



// Function to Create Quiz
export const createQuiz = async (req, res) => {

  try {

    const {
      title,
      category,
      level,
      mode,
      questionsCount,
      scoreForBadge,
      questions
    } = req.body;

    const newQuiz = new quizModel({
      title,
      category,
      level,
      mode,
      questionsCount,
      scoreForBadge,
      questions,
      createdBy: req.userId
    });

    await newQuiz.save();

    res.status(200).json({ success: true, message: "Quiz created successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating quiz" });
  }

};



// Function to submit contact form
export const submitContactForm = async (req, res) => {

  try {

    const { contactName, contactEmail, contactQuery } = req.body;

    if (!contactName || !contactEmail || !contactQuery) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const contact = new contactModel({ contactName, contactEmail, contactQuery });
    await contact.save();

    res.status(200).json({ success: true, message: "Contact form submitted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting contact form" });
  }

};



// Function to get contact forms details
export const getContactForms = async (req, res) => {

  try {

    const contacts = await contactModel.find().sort({ submittedAt: -1 });  // recent first

    res.status(200).json({
      success: true,
      message: "Contact queries sent successfully to Admin",
      contacts
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending contact queries to Admin" });
  }

};



// Function to delete user
export const deleteUserById = async (req, res) => {

  try {

    const deleteUserId = req.params.id;

    const deletedUser = await userModel.findByIdAndDelete(deleteUserId);
    if (!deletedUser) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }

};
