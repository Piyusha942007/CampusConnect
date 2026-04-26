const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('Nodemailer initialized with user:', process.env.EMAIL_USER);

const sendOTP = async (email, otp) => {
  console.log(`Attempting to send OTP to ${email}...`);
  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your CampusConnect Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #4f46e5; margin-bottom: 24px;">Verify your account</h2>
        <p style="color: #475569; font-size: 16px; line-height: 24px;">
          Welcome to CampusConnect! Use the code below to verify your email address and complete your registration.
        </p>
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; text-align: center; margin: 32px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};

module.exports = { sendOTP };
