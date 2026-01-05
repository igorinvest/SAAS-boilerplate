const {UserCompanyModel} = require('../../models/models');
const { sequelize } = require('../../models/sequelize');

module.exports.userCompanyDataService = new class UserCompanyDataService {

    async getUserByEmail(email) {
        const user = await sequelize.query(`
            select 
                users.*, 
                "userCompanies"."companyId"
            from users
            left join "userCompanies" ON users."userId"="userCompanies"."userId"
                and "userCompanies"."isBlocked" <> true
                and "userCompanies"."isAccepted" = true
                and "userCompanies"."isDefault" = true
            where users."email"=:email
            limit 1;
            `,{
                replacements: { email: email },
                type: sequelize.QueryTypes.SELECT,
                //model: UserModel,
            });
        return user[0];
    }

    async getUserById(userId) {
        const user = await sequelize.query(`
        select 
            users.*, 
            "userCompanies"."companyId",
            "userCompanies"."isAdmin"
        from users
        left join "userCompanies" ON users."userId"="userCompanies"."userId"
            and "userCompanies"."isBlocked" <> true
            and "userCompanies"."isAccepted" = true
            and "userCompanies"."isDefault" = true
        where users."userId"=:userId
        limit 1;
        `,{
            replacements: { userId: userId },
            type: sequelize.QueryTypes.SELECT,
            //model: UserModel, - if you enable it, companyId will not be available in the model, so please don't do that
        })
        return user[0];
    }

    //This is a list of all companies/spaces I'm currently part of
    async getUserCompanies(user) {
        const companies = await sequelize.query(`
            select
                uc."userCompanyId",
                uc."companyId",
                uc.email,
                uc."isAccepted",
                uc."isDefault",
                uc."isAdmin",
                c."companyName",
                u.email as "invitedBy"
            from "userCompanies" uc
            left join companies c on c."companyId" = uc."companyId"
            left join users u on u."userId" = uc."createdBy"
            where
                (uc."userId"=:userId or uc."email"=:email)
                and uc."userCompanyId" is not null
                and uc."isBlocked" <> true;
            `,{
                replacements: { email: user.email, userId: user.userId },
                type: sequelize.QueryTypes.SELECT,
            });
        return companies;
    }

    //This is the list of all other users in my acivated company/space
    async getAllUsers(user) {
        const users = await sequelize.query(`
            select
                users."userName", users."isActivated", users."email", "userCompanies".*
            from "userCompanies"
                left join "users" ON "userCompanies"."userId"=users."userId"
            where
                "userCompanies"."companyId"=:companyId;
            `,{
                replacements: { companyId: user.companyId },
                type: sequelize.QueryTypes.SELECT,
                //model: UserModel,
            });
        return users;
    }

    //This changes default company/space - it's included in access token
    async changeDefaultCompany(user, userCompanyId) {
        const userCompanies = await sequelize.query(`
            UPDATE "userCompanies" as UC
            SET "isDefault" = 
	            CASE WHEN UC."userCompanyId"=:userCompanyId THEN true
	            ELSE false
	            END
            WHERE
                UC."userId"=:userId
                or UC."email"=:email;
        `,{
            replacements: { 
                userCompanyId: userCompanyId,
                userId: user.userId,
                email: user.email,
            },
            type: sequelize.QueryTypes.UPDATE,
        }).catch(() => {return false});
        return userCompanies;
    }

    //This function is to get an invitation that has not been accepted yet
    async getUserCompanyInvitation(user, userCompanyId) {
        const userCompany = await UserCompanyModel.findOne({where: {
            email: user.email,
            userCompanyId: userCompanyId,
            isBlocked: false
        }});
        return userCompany;
    }

}
