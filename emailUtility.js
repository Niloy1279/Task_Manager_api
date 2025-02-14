import nodemailer from 'nodemailer';
import {EMAIL_HOST, EMAIL_PASS, EMAIL_SECURITY, EMAIL_USER} from "../config/config.js";

const SendEmail=async(EmailTo,EmailText,EmailSubject)=>{

    let transporter = nodemailer.createTransport({
        host: "mail.teamrabbil.com",
        port: 25,
        secure: false,
        auth:{
            user:"info@teamrabbil.com",
            pass: "sR4[bhaC[Qs",
        },
        tls:{
            rejectUnauthorized:false,
        }
    })

    let mailOptions ={
        from: "Task manager MERN <info@teamrabbil.com>",
        to:EmailTo,
        subject: EmailSubject,
        text:EmailText,
    }

    return await transporter.sendMail(mailOptions)
}
export default SendEmail;

