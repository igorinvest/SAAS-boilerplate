const {tempLinkDataService} = require('./temp-link-data');

module.exports.tempLinkService = new class TempLinkService {

    async createLoginLink(email) {
        const existingLink = await tempLinkDataService.getLoginLinkByEmail(email);
        if(existingLink) {
            await tempLinkDataService.deleteLink(existingLink);
        }
        const loginLink = await tempLinkDataService.createLoginLink(email);
        return loginLink;
    }

}