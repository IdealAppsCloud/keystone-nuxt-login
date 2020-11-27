function sendMail (email, token) {
    const { emailSender } = require('@keystonejs/email');

    const pugEmailSender = emailSender.pug({
    // The directory containing the email templates
    root: `${__dirname}/templates`,
    // The transport to send the emails (see `keystone-email` docs)
    transport: 'mailgun'
    });

    console.log('email: '+email)
    console.log('token: '+token)
    
    // await pugEmailSender('new-user.pug').send(
    pugEmailSender('new-user.pug').send(
        {
            token
        }, // renderer props
        { 
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
            to: email,
            from: {
                name: process.env.MAILGUN_FROM_NAME,
                email: process.env.MAILGUN_FROM_EMAIL,
            },
            subject: 'Keystone user activation', 
        }, // transport options (api keys, to/from, etc). See `keystone-email` docs
        function (err, result) {
            if (err) {
            console.error('🤕 Mailgun test failed with error:\n', err);
            } else {
            console.log('📬 Successfully sent Mailgun test with result:\n', result);
            }
        }
    );

}

module.exports = { sendMail }
