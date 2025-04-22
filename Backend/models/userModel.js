import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    developerId: {
        type: String,
        unique: true,
        required: true,
    },
    avatar: {
        type: String,
        default: "maleAvatar.jpg",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    quizzesTaken: [
        {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },
            title: String,
            category: String,
            level: String,
            mode: String,
            questionsCount: Number,
            score: Number,
            badgeEarned: Boolean,
            date: { type: Date, default: Date.now },
        }
    ],
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    linkedinLink: {
        type: String
    },
    githubLink: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
