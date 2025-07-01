const express = require('express');
const dotenv = require('dotenv');
const Brevo = require('@getbrevo/brevo');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

app.get('/sendOtp', async (req, res) => {
    const { email, otp } = req.query;

    if (!email || !otp) {
        return res.status(400).send('Missing email or otp parameter');
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Your OTP Code";
    sendSmtpEmail.htmlContent = `<p>Your OTP is: <strong>${otp}</strong></p>`;
    sendSmtpEmail.sender = { name: "Volvo Site Application", email: "vspcramagundam@gmail.com" };
    sendSmtpEmail.to = [{ email: email }];

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.send('OTP sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send OTP');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
