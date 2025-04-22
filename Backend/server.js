import express from "express";
import { fileURLToPath } from 'url';
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";


import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = process.env.PORT || 4000;
connectDB();


const allowedOrigins = [process.env.FRONTEND_URL];


app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API Endpoints
app.get("/", (req, res) => {
    res.send("API working");
});

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/user", userRouter);

// Fallback route
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Central Error Handler
app.use((err, req, res, next) => {
    console.error("Error Handler :", err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});


app.listen(port, () => console.log(`Server started on port: ${port}`));
