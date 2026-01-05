require('dotenv').config()
const { config } = require('../config');
const { CompanyModel, UserModel, UserCompanyModel, ProjectModel, TempLinkModel, TokenModel, ExternalProjectModel } = require('./models');
const { sequelize } = require('./sequelize');

const syncSequelizeModels = async function () {
    let modelSync;
    if(config.modelSync === 'alter') modelSync = {alter: true};
    else if(config.modelSync === 'force') modelSync = {force: true};

    await CompanyModel.sync(modelSync).catch(e => console.log(e));
    await UserModel.sync(modelSync).catch(e => console.log(e));
    await UserCompanyModel.sync(modelSync).catch(e => console.log(e));
    await ProjectModel.sync(modelSync).catch(e => console.log(e));
    await ExternalProjectModel.sync(modelSync).catch(e => console.log(e));
    await TempLinkModel.sync(modelSync).catch(e => console.log(e));
    await TokenModel.sync(modelSync).catch(e => console.log(e));
}

class DatabaseService {

    async startDatabase() {
        //Auth and Sync models to database with sequelize
        await sequelize.authenticate();
        if(config.modelSync !== 'none') {
            await syncSequelizeModels();
        }
    }

}

module.exports.databaseService = new DatabaseService();