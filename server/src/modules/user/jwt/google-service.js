const {OAuth2Client} = require('google-auth-library');
const {config} = require('../../../config.js');

class GoogleAuthService {
    client = new OAuth2Client();

    async verify(token) {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: config.googleClientId,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        //const userid = payload['sub'];
        return payload;
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
    }

}

module.exports = new GoogleAuthService();