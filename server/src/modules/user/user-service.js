
const {userDataService} = require('./user-data');
const {mailService} = require('../mail/mail-wrapper-service');
const tokenService = require('./jwt/token-service');
const UserDto = require('../../dtos/user-dto');
const ApiError = require('../../api/api-error');
const { DateTime } = require("luxon");
const googleService = require('./jwt/google-service');
const { userCompanyService } = require('./user-company-service');
const companyService = require('../company/company-service');
const { companyAdmin } = require('./company-admin');
const { externalProjectService } = require('../company/project/external-project-service');
const { config } = require('../../config');
const commonService = require('../../common-service');
const { userCompanyDataService } = require('./user-company-data');
const { tempLinkService } = require('./temp-link/temp-link-service');
const { tempLinkDataService } = require('./temp-link/temp-link-data');

class UserService {

    async googleAuth(googleData) {
        const payload = await googleService.verify(googleData.credential);
        if(!payload.email_verified) {
            throw ApiError.BadRequest("Email is not verified")
        }
        const tokens = await this.registerUser(payload.email, payload.name);
        return tokens;
    }

    async registerUser(email, name) {
        const existingUser = await userCompanyDataService.getUserByEmail(email);
        //If user exists just login
        if(existingUser) {
            if(!existingUser.isActivated) {
                existingUser.isActivated = true;
                await existingUser.save();
            }
            const tokens = await tokenService.updateTokens(existingUser);
            return tokens;
        } else {
            const user = await userDataService.createUser({
                email: email,
                userName: name,
                hashPassword: 0,
                isActivated: true,
                //companyId: company.companyId
            });
            if(!user) {
                throw ApiError.BadRequest('Something went wrong, please contact support')
            }
            await this.postRegistrationProcess(user);
            const tokens = await tokenService.updateTokens(user);
            return tokens;
        }
    }

    async postRegistrationProcess(user) {
        await externalProjectService.addProjectBookmark(user, config.landingProjectId);
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }
        
        //const user = await UserModel.findByPk(userData.userId);
        const dbUser = await userCompanyDataService.getUserById(userData.userId);
        if (!dbUser) {
            throw ApiError.UnauthorizedError();
        }
        const userDto = new UserDto(dbUser);
        const accessToken = tokenService.generateAccess({...userDto});
        //console.log(accessToken, userDto)
        return {user: userDto, "accessToken": accessToken};
    }

    async sendLoginLink(email) {
        const loginLink = await tempLinkService.createLoginLink(email);
        const pinCode = commonService.generateId(4);
        loginLink.verificationCode = pinCode;
        await loginLink.save();
        mailService.sendLoginLinkEmail(email, loginLink);
        return loginLink.linkRef;
    }

    async loginWithLink(loginLinkRef, pinCode) {
        const loginLink = await tempLinkDataService.getLoginLinkByRef(loginLinkRef);
        if (!loginLink) {
            throw ApiError.BadRequest('Incorrect link')
        }
        if (loginLink.verificationCode !== pinCode) {
            await loginLink.destroy();
            throw ApiError.BadRequest('Incorrect pin code')
        }
        if (loginLink.expiredAt <= DateTime.now().toUTC()) {
            await loginLink.destroy();
            throw ApiError.BadRequest('The link is expired')
        }

        const tokens = await this.registerUser(loginLink.email, '');
        await loginLink.destroy();
        return tokens;
    }

    //Company related functions, move to Admin service?
    async createCompany(user, companyName) {
        if(!companyName) {
            throw ApiError.BadRequest("Company name can't be empty")
        }
        const company = await companyService.createCompany(user, companyName);
        if(!company) {
            throw ApiError.BadRequest('Something went wrong, please contact support')
        }
        user.companyId = company.companyId;
        const userCompany = await companyAdmin.addCreatorToCompany(user);
        if(!userCompany) {
            throw ApiError.BadRequest('Something went wrong, please contact support')
        }
        const updatedList = await this.activateCompany(user, userCompany.userCompanyId);
        return updatedList;
    }

    async acceptCompanyInvitation(user, userCompanyId) {
        const userCompany = await userCompanyService.acceptInvitation(user, userCompanyId);
        if(!userCompany) {
            throw ApiError.BadRequest('Something went wrong, please contact support')
        }
        const updatedList = await this.activateCompany(user, userCompany.userCompanyId);
        return updatedList;
    }

    async activateCompany(user, userCompanyId) {
        const isUpdated = await userCompanyService.changeDefaultCompany(user, userCompanyId)
        if(!isUpdated) {
            throw ApiError.BadRequest('Something went wrong, please contact support')
        }
        const updatedList = await userCompanyService.getUserCompanies(user);
        return updatedList;
    }

    async getUser(user) {
        const existingUser = await userDataService.getUserByPk(user.userId);
        return existingUser;
    }

    async renameUser(user, userName) {
        const toBeUpdated = await userDataService.getUserByPk(user.userId);
        toBeUpdated.userName = userName;
        await toBeUpdated.save();
        return toBeUpdated;
    }

}

module.exports = new UserService();
