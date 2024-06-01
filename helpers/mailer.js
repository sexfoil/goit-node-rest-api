import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASSWORD, UKR_NET_FROM, PORT } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 2525, // 25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_FROM };
  return transport.sendMail(email);
};

export const getVerifyEmailContent = (req, verificationToken) => {
  const verificationUrl = `${req.protocol}://${req.hostname}:${PORT}/api/users/verify/${verificationToken}`;

  const emailContent = {
    to: req.body.email,
    subject: "Verify email",
    html: `<a target="_blank" href="${verificationUrl}">Click verify email</a>`,
  };

  return emailContent;
};
