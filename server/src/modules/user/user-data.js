const {UserModel} = require('../../models/models');
const logger = require('../../logger');
const { config } = require('../../config');

module.exports.userDataService = new class UserDataService {

    async createUser(userData) {
        const user = await UserModel.create({ 
            email: userData.email, 
            password: userData.hashPassword, 
            isActivated: userData.isActivated || false,
        }).catch(e => logger(e));
        return user;
    }

    async getUserByEmail(email) {
        const user = await UserModel.findOne({ where: {email: email}}).catch(e => logger(e));
        return user;
    }

    async getUserByPk(userId) {
        const user = await UserModel.findByPk(userId).catch(e => console.log(e));
        return user;
    }

    async getFakeUser() {
        const fakeUser = await UserModel.findOne({ where: {email: config.fakeUserEmail}}).catch(e => logger(e));
        if(fakeUser) {
            return fakeUser;
        }
        const newFakeUser = await UserModel.create({ 
            email: config.fakeUserEmail, 
            password: '0', 
            isActivated: true,
        }).catch(e => logger(e));
        return newFakeUser;
    }

}
