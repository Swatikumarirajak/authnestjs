import nodemailer from 'nodemailer';
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}:any)=>
{
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
            if(emailType === "VERIFY"){
                const updatedUser = await User.findByIdAndUpdate
                (userId,{
                    $set:{
                    verifyToken:hashedToken, 
                    verifyTokenExpiry: new Date(Date.now() + 3600000)
                }
                });
            }else if(emailType === "RESET"){
                await User.findByIdAndUpdate
                (userId,{
                    $set:{
                    forgotPasswordToken:hashedToken, 
                    forgotPasswordExpiry: new Date(Date.now() + 3600000)}
            
            });
}

            var transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "565356c8a07553",
                  pass: "b3998bc8e4e0fc"
                }
              });

          const mailOptions = {
            from: 'skr@skr.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email": "Reset your email", // Subject line
            html: `<p> Click <a href ="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY"? "Verify your email" : "reset your password"} 
            or copy and paste the link below in your browser
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
          }

         const mailResponse =  await transport.sendMail(mailOptions)
         return mailResponse

    } catch (error:any) {
        throw new Error(error.message)
    }
}