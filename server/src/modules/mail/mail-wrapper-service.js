require('dotenv').config();

module.exports.mailService = function() {
    const mailType = process.env.EMAIL_TYPE;
    if(mailType === 'CONSOLE') {
        return require('./mail-console');
    } else if(mailType === 'AWS') {
        return require('./mail-ses');
    } else if(mailType === 'SMTP') {
        return require('./mail-smtp');
    }
}();