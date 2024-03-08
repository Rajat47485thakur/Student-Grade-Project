const nodemailer = require('nodemailer');

async function sendGrade(to, text) {
    try {
        // console.log("check 1 in the try====================================");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
                user: 'rishuthakur47485@gmail.com',
                pass: 'watn evdg rixq sqde'
            }
        });

        const mailOptions = {
            from: 'rishuthakur47485@gmail.com',
            to,
            subject: 'Notification about your Result',
            text,
            replyTo: 'fullstacktester@yopmail.com'
        };
        // console.log(mailOptions+"check 2 in the try====================================");

        await transporter.sendMail(mailOptions);
        // console.log(check+"check 3 in the try====================================");
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
// console.log("this is the check log out side the function -----------------------");

module.exports = { sendGrade };
// sendGrade('rajat24apptunix@gmail.com', 'Congratulation! You got "A" Grade');