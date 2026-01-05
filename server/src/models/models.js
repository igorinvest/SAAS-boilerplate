require('dotenv').config()
const {attributes} = require('./attributes');
const { sequelize } = require('./sequelize');

const CompanyModel = sequelize.define('CompanyModel', attributes.company, 
    { 
        tableName: 'companies',
        indexes: [{
            fields: ['companyId']
        }]
    }
);

const UserModel = sequelize.define('UserModel', attributes.user, { 
    tableName: 'users',
    indexes: [{
        fields: ['userId', 'email']
    }]
});

const UserCompanyModel = sequelize.define('UserCompanyModel', attributes.userCompanies, { 
    tableName: 'userCompanies',
    indexes: [{
        fields: ['userId', 'companyId']
    }]
});
UserCompanyModel.belongsTo(UserModel, {
    foreignKey: 'createdBy',
});
UserModel.hasMany(UserCompanyModel, {
    foreignKey: 'createdBy',
});
UserCompanyModel.belongsTo(CompanyModel, {
    foreignKey: 'companyId',
    allowNull: false,
    validate: {
        notNull: true,
    }
});
CompanyModel.hasMany(UserCompanyModel, {
    foreignKey: 'companyId',
    allowNull: false,
});

const TempLinkModel = sequelize.define('TempLinkModel', attributes.tempLink, {
    tableName: 'tempLinks',
    paranoid: false 
});

const TokenModel = sequelize.define('TokenModel', attributes.token, {
        tableName: 'tokens',
        paranoid: false,
        indexes: [{
            fields: ['refreshToken', 'userId']
        }]
});
TokenModel.belongsTo(UserModel, {
    foreignKey: {
        name: "userId",
        allowNull: false
    }
});
UserModel.hasOne(TokenModel, {
    foreignKey: {
        name: "userId",
        allowNull: false
    }
});

const ProjectModel = sequelize.define('ProjectModel', attributes.project, { 
    tableName: 'projects',
    indexes: [{
        fields: ['projectId', 'companyId', 'isPublic', 'publishDate']
    }]
});
ProjectModel.belongsTo(CompanyModel, {
    foreignKey: {
        name: "companyId",
        allowNull: false
    },
});
ProjectModel.hasMany(ProjectModel, {as: 'children', foreignKey: 'parentId'});
ProjectModel.belongsTo(ProjectModel, {as: 'parent', foreignKey: 'parentId'});
ProjectModel.belongsTo(UserModel, {
    foreignKey: {
        name: "author",
        allowNull: false
    },
    targetKey: "userId",
    validate: {
        notNull: true,
    }
});
ProjectModel.belongsTo(UserModel, {
    foreignKey: {
        name: "editedBy",
        allowNull: false
    },
    targetKey: "userId",
    validate: {
        notNull: true,
    }
});

const ExternalProjectModel = sequelize.define('ProjectModel', attributes.externalProject, { 
    tableName: 'externalProjects',
    indexes: [{
        fields: ['externalProjectId', 'role', 'projectId']
    }]
});
ExternalProjectModel.belongsTo(ProjectModel, {
    foreignKey: {
        name: "projectId",
        allowNull: false
    },
    targetKey: "projectId",
    validate: {
        notNull: true,
    }
});
ProjectModel.hasMany(ExternalProjectModel, {
    foreignKey: {
        name: "projectId",
    }
});
ExternalProjectModel.belongsTo(UserModel, {
    foreignKey: {
        name: "userId",
        allowNull: false
    },
    targetKey: "userId",
    validate: {
        notNull: true,
    }
});
UserModel.hasMany(ExternalProjectModel, {
    foreignKey: {
        name: "userId",
    }
});


module.exports.CompanyModel = CompanyModel;
module.exports.UserModel = UserModel;
module.exports.UserCompanyModel = UserCompanyModel;
module.exports.ProjectModel = ProjectModel;
module.exports.ExternalProjectModel = ExternalProjectModel;
module.exports.TempLinkModel = TempLinkModel;
module.exports.TokenModel = TokenModel;
