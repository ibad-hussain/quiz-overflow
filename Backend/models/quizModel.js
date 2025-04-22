import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    level: {
        type: String,
        required: true,
        trim: true,
    },
    mode: {
        type: String,
        required: true,
        trim: true,
    },
    questionsCount: {
        type: Number,
        required: true,
    },
    scoreForBadge: {
        type: Number,
        required: true,
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true },
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const quizModel = mongoose.models.quiz || mongoose.model("quiz", quizSchema);

export default quizModel;
