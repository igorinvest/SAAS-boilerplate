const nodemailer = require('nodemailer');
const logger = require('../../logger.js');
const path = require('path')
require('dotenv').config()
const htmlService = require('./html-service.js');
const { config } = require('../../config.js');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          //host: process.env.SMTP_HOST,
          //port: process.env.SMTP_PORT,
          //secure: false,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
          }
        })
    }

    async sendLoginLinkEmail(to, tempLink) {
      const tPath = path.join(__dirname, './templates/pin.html');
      const template = await htmlService.getDocument(tPath);
      let html = await htmlService.addFieldsToHTML(template, [{pin: tempLink.verificationCode}]);
      //html = await htmlService.addHrefToHTML(template, [{unsubscribe: `https://docion.com/unsubscribe/?email=${to}/`}]);
      //html = await htmlService.addHrefToHTML(template, [{verifylink: `${config.url || 'https://docion.com'}/verify-email/${tempLink.linkRef}/${tempLink.verificationCode}/`}]);
      const email = {
          from: 'noreply@docion.com',
          to: to,
          subject: 'Login to Docion.com',
          text: '',
          html: html.serialize(),
          attachments: [
            {
              filename: config.logoName,
              path: config.productPath + "/" + config.logoName,
              cid: 'logo', //same cid value as in the html img src
              contentType: 'image/png'
            }
          ]
      }
      const result = await this.transporter.sendMail(email).catch(e => logger(e));
      return result;
    }

}

module.exports = new MailService();