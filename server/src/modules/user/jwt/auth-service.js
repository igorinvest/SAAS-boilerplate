const ApiError = require('../../../api/api-error');
const tokenService = require('./token-service');

module.exports = function (accessToken) {
    try {
        
        if (!accessToken) {
            throw ApiError.UnauthorizedError('No token provided');
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            throw ApiError.UnauthorizedError('You are not logged in');
        }
        
        if (!userData.isActivated) {
            throw ApiError.UnauthorizedError('Please verify your email first');
        }

        return userData;
    } catch (e) {
        throw ApiError.UnauthorizedError(e);
    }
};
