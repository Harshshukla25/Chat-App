import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // your Gmail address
        pass: process.env.EMAIL_PASS,  // app password from Google
      },
    });

    const mailOptions = {
      from: `"ChitChat Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully");
  } catch (error) {
    console.error(" Email not sent:", error);
  }
};

export default sendEmail;
