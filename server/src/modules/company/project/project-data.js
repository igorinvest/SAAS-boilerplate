const {ProjectModel} = require('../../../models/models');
//const fileService = require('../../service/file-service');
const logger = require('../../../logger');
const { sequelize } = require('../../../models/sequelize');

//const listAttributes = ['projectId', 'name', 'parentId', 'isPublic'];

module.exports.projectDataService = new class ProjectDataService {

    async create(user, projectDraft) {
        const proj = await ProjectModel.create({ 
            projectName: projectDraft.projectName,
            type: projectDraft.type,
            companyId: user.companyId,
            parentId: projectDraft.parentId || null,
            author: user.userId,
            editedBy: user.userId,
        }).catch(e => {logger(e)});
        return proj;
    }

    async getProjects(user) {
        const projects = await sequelize.query(`
            select *
            from projects
            where projects."companyId"=:companyId
            order by projects."createdAt" ASC
            `,{
                replacements: { companyId: user.companyId },
                type: sequelize.QueryTypes.SELECT,
                model: ProjectModel,
            });
        return projects;
    }

    async archiveProjects(user, projects) {
        for (let index = 0; index < projects.length; index++) {
            projects[index].isArchived = true;
            projects[index].editedBy = user.userId;
            await projects[index].save().catch(e => {
                logger(e);
            });
        }
        return projects;
    }

    async getProjectById(user, projectId) {
        const proj = await ProjectModel.findOne({ where: { projectId: projectId, companyId: user.companyId }}).catch(e => {logger(e)});
        return proj;
    }

    async getPublicProjectById(projectId) {
        const proj = await ProjectModel.findOne({ 
            where: { 
                projectId: projectId, 
                isPublic: true
            }}).catch(e => {logger(e)});
        return proj;
    }

    async changeParent(user, project, parentId) {
        project.parentId = parentId;
        project.editedBy = user.userId;
        await project.save().catch(e => {logger(e)});
        return project;
    }

}

