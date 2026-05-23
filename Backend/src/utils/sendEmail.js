const nodemailer = require("nodemailer");

async function sendEmail(options) {
    try {
        // Create a test account for Ethereal Email since we don't have SMTP credentials
        let testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: '"Spotify Clone" <no-reply@spotifyclone.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = sendEmail;
