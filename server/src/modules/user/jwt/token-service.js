const jwt = require('jsonwebtoken');
const {TokenModel} = require('../../../models/models');
const ApiError = require('../../../api/api-error');
const logger = require('../../../logger');
const {config} = require('../../../config');
const UserDto = require('../../../dtos/user-dto');

class TokenService {

    async updateTokens(user) {
        const userDto = new UserDto(user);
        const tokens = {};
        tokens.refreshToken = this.generateRefresh({...userDto});
        tokens.accessToken = this.generateAccess({...userDto});
        //console.log(tokens.refreshToken);
        await this.saveToken(userDto.userId, tokens.refreshToken);
        return {...tokens, user: {...userDto}}
    }

    generateAccess(payload) {
        const accessToken = jwt.sign(payload, config.jwtAccessSecret, {expiresIn: '600s'})
        //console.log(accessToken);
        return accessToken;
    }

    generateRefresh(payload) {
        const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {expiresIn: '30d'})
        //console.log(refreshToken);
        return refreshToken;
    }

    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, config.jwtAccessSecret);
            //console.log(userData, accessToken);
            return userData;
        } catch {
            //console.log(e)
            return null;
        }
    }

    async validateRefreshToken(refreshToken) {
        if(!refreshToken) {
            return null;
        }
        try {
            const userData = jwt.verify(refreshToken, config.jwtRefreshSecret);
            const tokenFromDb = await this.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError();
            }
            return userData;
        } catch {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({where: {userId: userId}}).catch(e => logger(e));
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save().catch(e => logger(e));
        }
        const token = await TokenModel.create({userId: userId, refreshToken: refreshToken}).catch(e => logger(e));
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.destroy({where: {refreshToken: refreshToken}}).catch(e => logger(e));
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({where: {refreshToken: refreshToken}}).catch(e => logger(e));
        return tokenData;
    }

    async getRefreshByUserId(userId) {
        const tokenData = await TokenModel.findOne({where: {userId: userId}}).catch(e => logger(e));
        return tokenData;
    }
}

module.exports = new TokenService();
 