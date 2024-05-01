import createMailTransporter from "./createMailTransporter.js"


const sendVerificationMail = (user) =>{
    const transporter = createMailTransporter();

    const mailOptions = {
        from: "Threads App <threads_testing@outlook.com>",
        to: user.email,
        subject: "Please Verify your email",
        html: `<p>Hello 👋 ${user.name}, Please verify your email by clicking on this link..</p>
        <a href = '${process.env.CLIENT_URL}Verify/${user.emailToken}'>CLICK HERE</a>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
        }else{
            console.log("Verification Email Sent")
        }
    });

    };

    export default sendVerificationMail;

    