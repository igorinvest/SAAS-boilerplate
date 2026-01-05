const { config } = require('../../config.js');
const templateService = require('./template');
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
require('dotenv').config();

class MailService {

    constructor() {
        this.ses = new SESClient({ region: process.env.AWS_SES_REGION });
        this.from = 'noreply@docion.com'
    }

    async sendActivationEmail(to, ref) {
      const mail = templateService.getActivationEmail(ref);
      const params = new SendEmailCommand({
        Destination: {
         ToAddresses: [to]
        }, 
        Message: {
         Body: {
          Html: {
           Charset: "UTF-8", 
           Data: mail.html
          }, 
          Text: {
           Charset: "UTF-8", 
           Data: mail.text
          }
         }, 
         Subject: {
          Charset: "UTF-8", 
          Data: mail.subject
         }
        }, 
        Source: this.from,
      });
      try {
        await this.ses.send(params);
      } catch (e) {
        console.error("Failed to send email.", e);
      }
    }

    async sendUpdatePasswordEmail(to, ref) {
      const mail = templateService.getUpdatePasswordEmail(ref);
      const params = new SendEmailCommand({
        Destination: {
         ToAddresses: [to]
        }, 
        Message: {
         Body: {
          Html: {
           Charset: "UTF-8", 
           Data: mail.html
          }, 
          Text: {
           Charset: "UTF-8", 
           Data: mail.text
          }
         }, 
         Subject: {
          Charset: "UTF-8", 
          Data: mail.subject
         }
        }, 
        Source: this.from,
      });
      try {
        await this.ses.send(params);
      } catch (e) {
        console.error("Failed to send email.", e);
      }
    }

    async sendLoginLinkEmail(to, ref) {
      return true;
  }

}

module.exports = new MailService();