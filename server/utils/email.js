import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (
    email,
    resetLink
) => {
    console.log("Sending reset email to:", email);
    console.log("Using Gmail account:", process.env.MAIL_USER);

    const mailOptions = {
        from: `"TikaTrack" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "TikaTrack - Reset Your Password",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 10px;
            ">

                <h2 style="color: #2e7d32;">
                    TikaTrack
                </h2>

                <h3>Reset Your Password</h3>

                <p>
                    We received a request to reset your TikaTrack
                    account password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display: inline-block;
                        padding: 12px 22px;
                        background-color: #2e7d32;
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        margin: 15px 0;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <p>
                    Regards,<br>
                    <strong>TikaTrack Team</strong>
                </p>

            </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
};