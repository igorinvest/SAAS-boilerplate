const {TempLinkModel} = require('../../../models/models');
const { DateTime } = require("luxon");
const logger = require('../../../logger');
const commonService = require('../../../common-service');

module.exports.tempLinkDataService = new class TempLinkDataService {

    async deleteLink(link) {
        try{
            await link.destroy();
            return true;
        } catch (e) {
            logger(e);
            return false;
        }
    }

    async getLoginLinkByRef(linkRef) {
        const loginLink = await TempLinkModel.findOne({ where: {linkRef: linkRef, linkType: "login"}})
        return loginLink;
    }

    async getLoginLinkByEmail(email) {
        const loginLink = await TempLinkModel.findOne({ where: {email: email, linkType: "login"}})
        return loginLink;
    }

    async createLoginLink(email) {
        const expiration = DateTime.now().toUTC().plus({ hours: 1 });
        const loginLink = await TempLinkModel.create({ 
            email: email,
            linkRef: commonService.generateId(24), 
            linkType: "login", 
            expiredAt: expiration
        });
        return loginLink;
    }

}