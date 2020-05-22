const nodemailer = require('nodemailer');

const nconf = require('../../config');
const logger = require('../logger');

const mailer = nconf.get('mailer');

/*
let transporter;

nodemailer.createTestAccount()
  .then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    transporter.verify((error) => {
      if (error) {
        logger.error('Mailer error =>, %j', error.message);
      } else {
        logger.debug('Mailer: Server is ready to take our messages');
      }
    });
  });
*/


const transporter = nodemailer.createTransport(mailer.transporter);
transporter.verify((error) => {
  if (error) {
    logger.error('Mailer error =>, %j', error.message);
  } else {
    logger.debug('Mailer: Server is ready to take our messages');
  }
});

module.exports = ({
  to, subject, html, text,
}) => {
  const mailOptions = {
    from: mailer.from, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
    text,
  };

  logger.debug('mail options %o', mailOptions);
  return transporter.sendMail(mailOptions);
};
