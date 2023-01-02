import mailer from 'nodemailer'
import { google } from 'googleapis'

const { OAuth2 } = google.auth

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.CLIENT_REFRESH_TOKEN,
    process.env.OAUTH_PLAYGROUND
)

const Email = (to, url, text) => {

    oauth2Client.setCredentials({
        refresh_token: process.env.CLIENT_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()

    const STMPTransport = mailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.SENDER_MAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.CLIENT_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: to,
        subject: "Pets Service Center",
        html: ` 
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <img src="https://res.cloudinary.com/comsats-university-lahore/image/upload/v1660334023/Rehbar%20Pet%27s%20Clinic/WhatsApp_Image_2022-05-19_at_10.06.20_PM_ijqpbr.jpg" alt="Pet Service Center" width="150" height="150" style="margin-left: 40%; margin-right: 40%;"/>
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Pets Service Center.</h2>
            <p>Congratulations! You're almost set to start using Pet Service Center ✮ Pet's Management System.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin-left: 40%; margin-right: 40%; display: inline-block;">${text}</a>
        </div>
      `
    }

    STMPTransport.sendMail(mailOptions, (err, res) => {
        if(err) return err
        return res
    })
    
}

export default Email