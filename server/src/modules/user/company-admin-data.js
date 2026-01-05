const {UserCompanyModel, CompanyModel} = require('../../models/models');
const logger = require('../../logger');
const { sequelize } = require('../../models/sequelize');

module.exports.companyAdminData = new class CompanyAdminData {

    async createInvitation(params) {
        const userCompany = await UserCompanyModel.findOrCreate({where: { ...params }}).catch(e => logger(e));
        return userCompany[0];
    }

    //This function is to get another user from my company to edit his parameters
    async getUserCompanyAsAdmin(user, userCompanyId) {
        const companies = await sequelize.query(`
            select
                uc.*
            from "userCompanies" uc
            	left join "userCompanies" ucadmin on ucadmin."companyId" = uc."companyId"
            where
            	uc."userCompanyId" = :userCompanyId
            	and ucadmin."userId" = :userId
            	and ucadmin."isAdmin" = true
            	and ucadmin."isAccepted" = true
            	and ucadmin."isBlocked" = false;
            `, {
            replacements: { userCompanyId: userCompanyId, userId: user.userId },
            type: sequelize.QueryTypes.SELECT,
            model: UserCompanyModel
        });
        return companies[0];
    }

    //To check if invitation already exists
    async getUserCompanyAsAdminEmail(user, email) {
        const companies = await sequelize.query(`
            select
                uc.*
            from "userCompanies" uc
            	left join "userCompanies" ucadmin on ucadmin."companyId" = uc."companyId"
            where
            	uc."email" = :email
            	and ucadmin."userId" = :userId
            	and ucadmin."isAdmin" = true
            	and ucadmin."isAccepted" = true
            	and ucadmin."isBlocked" = false
            limit 1;
            `, {
            replacements: { email: email, userId: user.userId },
            type: sequelize.QueryTypes.SELECT,
            model: UserCompanyModel
        });
        return companies[0];
    }

    //This function is to get another user from my company to edit his parameters
    async getCompanyAsAdmin(user) {
        const companies = await sequelize.query(`
            select
                c.*
            from companies c
            	left join "userCompanies" ucadmin on ucadmin."companyId" = c."companyId"
            where
            	c."companyId" = :companyId
            	and ucadmin."userId" = :userId
            	and ucadmin."isAdmin" = true
            	and ucadmin."isAccepted" = true
            	and ucadmin."isBlocked" = false
            limit 1;
            `, {
            replacements: { userId: user.userId, companyId: user.companyId },
            type: sequelize.QueryTypes.SELECT,
            model: CompanyModel
        });
        return companies[0];
    }

}
