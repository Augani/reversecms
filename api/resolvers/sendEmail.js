const Email = require('../welcomeEmail');
const sgMail = require('@sendgrid/mail');
module.exports = async ({email})=>{
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: email,
  from: 'Reversecms@epareto.com',
  subject: 'Welcome to Reverse CMS',
  html: Email(),
};
sgMail.send(msg);
}