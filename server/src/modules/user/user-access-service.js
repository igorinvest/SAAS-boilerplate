const ApiError = require('../../api/api-error');
const validateAccessToken = require('./jwt/auth-service');
const { userCompanyDataService } = require('./user-company-data');

module.exports.userAccessService = new class UserAccessService {

    checkRouteAccess(routeParams, accessToken) {
        if (routeParams.auth !== false && !accessToken) {
            throw ApiError.UnauthorizedError("You are not logged in");
        } else if (routeParams.auth !== false && accessToken) {
            const user = validateAccessToken(accessToken);
            if (routeParams.checkAdminAccess == true && !user.isAdmin) {
                throw ApiError.UnauthorizedError("You have to be admin to do that");
            } else if (routeParams.checkAdminAccess == true && user.isAdmin) {
                const dbUser = userCompanyDataService.getUserById(user.userId);
                if(!dbUser) {
                    throw ApiError.UnauthorizedError("Failed to verify admin access");
                }
                if (dbUser.companyId !== user.companyId || !dbUser.isAdmin) {
                    throw ApiError.UnauthorizedError("Failed to verify admin access");
                }
            }
            return user;
        } else if (accessToken) {
            let user;
            try {
                user = validateAccessToken(accessToken);
                return user;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    // async checkAdminAccess(user) {
    //     const userCompany = await userCompanyDataService.getUserCompanyByUser(user);
    //     if(!userCompany.isAdmin) {
    //         throw ApiError.BadRequest('You have to be admin to do that');
    //     }
    // }

}
