const { userCompanyDataService } = require('./user-company-data');
const ApiError = require('../../api/api-error');

module.exports.userCompanyService = new class UserCompanyService {

    async getUserCompanies(user) {
        const companies = await userCompanyDataService.getUserCompanies(user);
        return companies;
    }

    async acceptInvitation(user, userCompanyId) {
        const userCompany = await userCompanyDataService.getUserCompanyInvitation(user, userCompanyId);
        if(userCompany.isBlocked) {
            throw ApiError.BadRequest("Can't accept this invitation")
        }
        userCompany.isAccepted = true;
        userCompany.userId = user.userId;
        await userCompany.save();
        return userCompany;
    }

    async changeDefaultCompany(user, userCompanyId) {
        if(!userCompanyId || typeof userCompanyId !== 'string') {
            throw ApiError.BadRequest("Incorrect id")
        }
        const result = await userCompanyDataService.changeDefaultCompany(user, userCompanyId);
        if(result !== false) {
            return true;
        } else {
            return true;
        }
    }

    async getAllUsers(user) {
        const users = await userCompanyDataService.getAllUsers(user);
        return users;
    }

}
