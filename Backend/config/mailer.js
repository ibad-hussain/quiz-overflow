import nodemailer from "nodemailer";
import "dotenv/config";


// Reusable transporter object using Brevo SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,  // Brevo SMTP login address
        pass: process.env.SMTP_PASS,  // Brevo SMTP Password
    },
});


// Function to send welcome email
const sendWelcomeEmail = async (to, name, avatar) => {
    const mailOptions = {
        from: `"Quiz Overflow" <${process.env.SENDER_EMAIL}>`,  // sender
        to: to,  // recipient email
        subject: 'Welcome to Quiz Overflow!',
        html: `
            <div style="text-align: center;">
                <h2>Welcome, ${name} 👋</h2>
                <img 
                    width="200"
                    style="border-radius: 10px; margin: 10px auto 30px auto; border: 4px solid #2196f3;"
                    src="${process.env.BACKEND_URL}/uploads/${avatar}"
                    alt="" 
                />
            </div>
            <p>We're excited to have you on board.</p>
            <p>Start exploring quizzes and earn badges!</p>
            <p>Happy learning 🚀</p>
            <br>
            <p>Continue to <a href=${process.env.FRONTEND_URL} style="font-weight: 550;">Quiz Overflow</a></p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending welcome email to ${to} : `, error);
    }
};

export default sendWelcomeEmail;
