import nodemailer from "nodemailer";

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "threads_testing@outlook.com",
            pass: process.env.EMAIL_PASS,
        },
    });

    return transporter;
};

export default createMailTransporter;