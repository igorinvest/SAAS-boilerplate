const { config } = require('../../config.js');

class ConsoleMailService {

    async sendActivationEmail(to, ref) {
        const link = `${config.clientUrl}${config.baseHref}/auth/verify-email/${ref}`
        console.log({
            from: config.SMTPUser,
            subject: 'Activate account on Docion.com' + link,
            link: `${link}`
        })
        return true;
    }

    async sendUpdatePasswordEmail(to, ref) {
        const link = `${config.clientUrl}${config.baseHref}/auth/change-password/${ref}`
        console.log({
            from: config.SMTPUser,
            subject: 'Reset password for Docion.com',
            link: `${link}`
        })
        return true;
    }

    async sendLoginLinkEmail(to, ref) {
        const link = `${config.clientUrl}${config.baseHref}/auth/login-link/${ref}`
        console.log({
            from: config.SMTPUser,
            subject: 'Login to Docion.com' + link,
            link: `${link}`
        })
        return true;
    }
    
}

module.exports = new ConsoleMailService();