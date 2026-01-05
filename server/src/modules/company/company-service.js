const {CompanyModel} = require('../../models/models');

class CompanyService {

    async getCompany(user) {
        const company = await CompanyModel.findByPk(user.companyId);
        return company;
    }

    async createCompany(user, companyName) {
        const company = await CompanyModel.create({ companyName: companyName });
        return company;
    }

}

module.exports = new CompanyService();
 