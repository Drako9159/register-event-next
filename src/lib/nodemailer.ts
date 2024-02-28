import nodemailer from "nodemailer";

const { NODEMAIL_MAIL } = process.env;
const { NODEMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAIL_MAIL,
    pass: NODEMAIL_PASS,
  },
});

const sendMail = async (
  addressee: string,
  subject: string,
  message: string
) => {
  try {
    const mailOptions = {
      from: NODEMAIL_MAIL,
      to: addressee,
      subject: subject,
      text: message,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail send: ", info.response);
  } catch (error) {
    console.log("Error in send mail: ", error);
  }
};


export function sendCodeMail(email: string, code: string) {
  const addressee = email;
  const subject = "Authentication Code - page.com";
  const message = `
        Hi there!
    
        Thank you for registering on page.com. To complete the authentication process, please use the following code:
    
        Code: ${code}
    
        This code is unique to your account. Do not share it with anyone. If you didn't request this authentication, please ignore this message.
    
        Thanks for joining page.com!
    
        Regards,
        The page.com Team
      `;

  sendMail(addressee, subject, message);
}

// example
// const addressee = "antonio.jar.dev@gmail.com";
// const subject = "Hey message subject";
// const message = "Hey message body";

// sendMail(addressee, subject, message);
