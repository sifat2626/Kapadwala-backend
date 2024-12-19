import nodemailer from 'nodemailer';
import config from '../config';

export const EmailService = {
  sendEmail: async (to: string, subject: string, text: string, html?: string) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: config.email_host, // e.g., 'smtp.gmail.com'
      port: Number(config.email_port), // e.g., 587
      secure: config.email_secure === 'true', // Use SSL for secure connections
      auth: {
        user: config.email_user, // Your email address
        pass: config.email_password, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Your Project Name" <${config.email_user}>`, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text version of the message
      html, // HTML version of the message
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  },
};
