const ApiError = require('../../../api/api-error');
const { externalProjectData } = require('./external-project-data');
const { projectDataService } = require('./project-data');

module.exports.externalProjectService = new class ExternalProjectService {

    async getExternalProjects(user) {
        const externalProjects = await externalProjectData.getExternalProjects(user);
        return externalProjects;
    }

    async addProjectBookmark(user, projectId) {
        const publicProject = await projectDataService.getPublicProjectById(projectId);
        if(!publicProject) {
            throw ApiError.BadRequest("Project not found");
        }
        const bookmark = await externalProjectData.getProjectBookmark(user, projectId);
        if(!bookmark) {
            await externalProjectData.addProjectBookmark(user, projectId);
        }
        const externalProjects = await this.getExternalProjects(user);
        return externalProjects;
    }

    async deleteExternalProject(user, projectId) {
        const externalProject = await externalProjectData.getExternalProject(user, projectId);
        if(!externalProject) {
            throw ApiError.BadRequest("Project not found");
        }
        try {
            await externalProject.destroy();
            const externalProjects = await this.getExternalProjects(user);
            return externalProjects;
        } catch {
            throw ApiError.BadRequest("Failed to delete external project");
        }
    }

}

