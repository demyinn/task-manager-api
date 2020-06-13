const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.emyinn@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}.` + 
            ` Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.emyinn@gmail.com',
        subject: 'Goodbye!',
        text: `Goodbye ${name}! Is there anything ` +
            `we could have done to keep you on board?` 
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}