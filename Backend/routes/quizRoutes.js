import express from "express";
import { getQuiz, getAllQuizTitles, getQuizzesByTitles, getAllQuizzes, submitQuiz } from "../controllers/quizController.js";
import userAuth from "../middlewares/userAuth.js";


const quizRouter = express.Router();

// Route to get all quizzes
quizRouter.get('/', userAuth, getAllQuizzes);

// Route to get all quiz titles
quizRouter.get('/titles', userAuth, getAllQuizTitles);

// Route to get all quizzes by title
quizRouter.get('/topic/:title', userAuth, getQuizzesByTitles);

// Route to get quiz with quizId
quizRouter.get("/:quizId", userAuth, getQuiz);

// Route to submit quiz with quizId
quizRouter.post("/:quizId/submit", userAuth, submitQuiz);


export default quizRouter;
