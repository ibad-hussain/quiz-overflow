import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true,
        trim: true,
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    contactQuery: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

const contactModel = mongoose.model("contact", contactSchema);

export default contactModel;
