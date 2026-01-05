const ApiError = require('../../api/api-error');
const { companyAdminData } = require('./company-admin-data');
const tokenService = require('./jwt/token-service');
const { userCompanyDataService } = require('./user-company-data');

//Functions that require admin access to the company/space. Might be used internally.
//Admin access should be checked on API level from access token.
module.exports.companyAdmin = new class CompanyAdmin {

    async createInvitation(adminUser, candidateEmail) {
        const userCompany = await companyAdminData.createInvitation({
            createdBy: adminUser.userId,
            companyId: adminUser.companyId,
            email: candidateEmail
        });
        if (!userCompany) {
            throw ApiError.BadRequest('Failed to create invitation')
        };
        return userCompany;
    }

    async createInvitationOthers(adminUser, candidateEmail) {
        const existingUser = await companyAdminData.getUserCompanyAsAdminEmail(adminUser, candidateEmail);
        if (existingUser) {
            throw ApiError.BadRequest("This user has already been added")
        }
        const userCompany = await this.createInvitation(adminUser, candidateEmail);
        if (!userCompany) {
            throw ApiError.BadRequest('Failed to create invitation')
        };
        const list = await userCompanyDataService.getAllUsers(adminUser);
        return list;
    }

    async addCreatorToCompany(adminUser) {
        const userCompany = await this.createInvitation(adminUser, adminUser.email);
        //await companyAdminData.removeDefault(user, userCompany.userCompanyId);
        userCompany.isAdmin = true;
        userCompany.isAccepted = true;
        //userCompany.isDefault = true;
        userCompany.userId = adminUser.userId;
        await userCompany.save();
        return userCompany;
    }

    async updateUserCompany(adminUser, changingUser) {
        if (adminUser.userId == changingUser.userId) {
            throw ApiError.BadRequest("Can't edit yourself")
        }
        const userCompany = await companyAdminData.getUserCompanyAsAdmin(adminUser, changingUser.userCompanyId);
        if(!userCompany) {
            throw ApiError.BadRequest("We couldn't get the necessary data")
        }
        let changes = false;
        if (changingUser.isBlocked !== userCompany.isBlocked) {
            const refreshToken = await tokenService.getRefreshByUserId(changingUser.userId);
            if(refreshToken) {
                await refreshToken.destroy();
            }
            userCompany.isBlocked = changingUser.isBlocked;
            changes = true;
        } else if (changingUser.isAdmin !== userCompany.isAdmin) {
            userCompany.isAdmin = changingUser.isAdmin;
            changes = true;
        }
        if(changes) {
            await userCompany.save();
        }
        const list = await userCompanyDataService.getUserCompanies(adminUser);
        return list;
        //return userCompany;
    }

    async updateCompany(adminUser, companyData) {
        const company = await companyAdminData.getCompanyAsAdmin(adminUser);
        if (!company) {
            throw ApiError.BadRequest("Failed to change name. Only support can help here, sorry.")
        }
        company.companyName = companyData.companyName;
        await company.save();
        const list = await userCompanyDataService.getUserCompanies(adminUser);
        return list;
        //return company;
    }

}

// async deleteUserCompany(adminUser, userCompanyId) {
//     if(!userCompanyId || typeof userCompanyId !== 'string') {
//         throw ApiError.BadRequest("Incorrect user company")
//     }
//     //const blocked = await userCompanyDataService.setIsBlocked(user, userCompanyId);
//     // if(!blocked) {
//     //     throw ApiError.BadRequest("Failed to remove user company")
//     // }
//     const companies = await userCompanyDataService.getUserCompanies(adminUser);
//     if(companies.length > 0) {
//         const def = await userCompanyDataService.changeDefaultCompany(adminUser, companies[0].userCompanyId);
//         if(!def) {
//             return companies;
//         }
//         companies[0].isDefault = true;
//         return companies;
//     }
//     return companies;
// }