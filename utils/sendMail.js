import mailer from 'nodemailer'
import { google } from 'googleapis'

const { OAuth2 } = google.auth;

const {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REFRESH_TOKEN,
    OAUTH_PLAYGROUND,
    SENDER_MAIL
} = process.env

const oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

const Email = (to, url) => {

    oauth2Client.setCredentials({
        refresh_token: CLIENT_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()

    const STMPTransport = mailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: SENDER_MAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: CLIENT_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_MAIL,
        to,
        subject: "Pets Service Center",
        html: ` 
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <img src="https://res.cloudinary.com/comsats-university-lahore/image/upload/v1660334023/Rehbar%20Pet%27s%20Clinic/WhatsApp_Image_2022-05-19_at_10.06.20_PM_ijqpbr.jpg" alt="Pet Service Center" width="150" height="150" style="margin-left: 40%; margin-right: 40%;"/>
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Pets Service Center.</h2>
            <p>Congratulations! You're almost set to start using Pet Service Center ✮ Pet's Management System.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin-left: 40%; margin-right: 40%; display: inline-block;">Verify Email</a>
        </div>
      `
    }

    STMPTransport.sendMail(mailOptions, (err, res) => {
        if(err) return err;
        return res;
    })
}

export default Email