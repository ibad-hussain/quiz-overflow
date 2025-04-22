import express from 'express';
import { getAdminDashboardData, createQuiz, submitContactForm, getContactForms, deleteUserById } from '../controllers/adminController.js';
import adminAuth from '../middlewares/adminAuth.js';


const adminRouter = express.Router();

// Route to get all users & quizzes data
adminRouter.get('/dashboard-data', adminAuth, getAdminDashboardData);

// Route to create quiz
adminRouter.post('/create-quiz', adminAuth, createQuiz);

// Route to submit contact form
adminRouter.post('/submit-contact', submitContactForm);

// Route to get all contact queries
adminRouter.get('/get-contact', adminAuth, getContactForms);

// Route to delete user
adminRouter.delete('/delete-user/:id', adminAuth, deleteUserById);


export default adminRouter;
