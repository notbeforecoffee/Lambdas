import dotenv from 'dotenv';
dotenv.config();
import nodeMailer from 'nodemailer';

export const handler = async (payload) => {
  const { emailBodyHTML, recipientEmail, subject, senderName } = payload;
  try {
    const serverEmail = process.env.SERVER_EMAIL;
    const serverEmailVerification = process.env.EMAIL_VERIFICATION;
    const EMAIL_PORT = process.env.EMAIL_PORT;
    const EMAIL_HOST = process.env.EMAIL_HOST;

    const transporter = nodeMailer.createTransport({
      //information about the mail server we are sending the email from
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        user: serverEmail,
        pass: serverEmailVerification,
      },
    });

    const response = await transporter.sendMail({
      from: senderName,
      to: recipientEmail,
      subject: subject,
      html: emailBodyHTML,
    });
    console.log('Message sent: ' + response.messageId);
    if (response)
      return {
        success: true,
        message: response.messageId,
      };
  } catch (e) {
    console.timeLog(e);
    return {
      success: false,
      message: e.message,
      payload:payload
    };
  }
};
