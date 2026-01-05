const ApiError = require('../../../api/api-error');
const { projectDataService } = require('./project-data');
const { DateTime } = require("luxon");

class ProjectService {

    async create(user, projectDraft) {
        if(!user?.companyId) {
            throw ApiError.BadRequest('Please create an organisation first');
        }
        const proj = await projectDataService.create(user, projectDraft);
        return proj;
    }

    async getProject(user, projectId) {
        const proj = await projectDataService.getProjectById(user, projectId);
        if (!proj) {
            throw ApiError.BadRequest(`Project not found`);
        }
        return proj;
    }

    async update(user, project) {
        const proj = await projectDataService.getProjectById(user, project.projectId);
        if (!proj) {
            throw ApiError.BadRequest(`Project not found`);
        }
        if ( project.projectName && project.projectName != proj.projectName ) {
            proj.projectName = project.projectName;
        }
        if(proj.isPublic != project.isPublic) {
            if(project.isPublic) {
                proj.publishDate = DateTime.now().toUTC()
            } else {
                proj.publishDate = null;
            }
            proj.isPublic = project.isPublic;
        }
        
        proj.editedBy = user.userId;
        proj.lastEdited = project.lastEdited;
        await proj.save();
        const projects = await this.getProjects(user);
        return projects;
    }

    async getProjects(user) {
        const projects = await projectDataService.getProjects(user);
        return projects;
    }

    // async changeParentProject(user, projectId, parentId) {
    //     let project = await projectDataService.getProjectById(user, projectId);
    //     //console.log(project)
    //     if (!project) {
    //         throw ApiError.BadRequest(`Project not found`);
    //     }
    //     if (project.projectId === parentId) {
    //         throw ApiError.BadRequest(`Can't be self parent`);
    //     }
    //     if(parentId) {
    //         const newParent = await projectDataService.getProjectById(user, parentId);
    //         if (!newParent) {
    //             throw ApiError.BadRequest(`Parent project not found or can't be used as parent`);
    //         }
    //     }
    //     const changedProject = await projectDataService.changeParent(user, project, parentId);
    //     if (!changedProject) {
    //         throw ApiError.BadRequest(`Something went wrong`);
    //     }
    //     const projects = await this.getProjects(user);
    //     return projects;
    // }

    async deleteProject(user, projectId) {
        const project = await projectDataService.getProjectById(user, projectId);
        if (!project) {
            throw ApiError.BadRequest(`Project not found`);
        }
        try {
            await project.destroy();
            const projects = await this.getProjects(user);
            return projects;
        } catch {
            throw ApiError.BadRequest(`Something went wrong`);
        }
    }

    //async archiveProject(user, projectId) {
        // const project = await projectDataService.getProjectById(user, projectId);
        // if (!project) {
        //     throw ApiError.BadRequest(`Project not found`);
        // }
        // const children = await projectDataService.getChildrenRecursively(user, project);
        // children.push(project);
        // let updated = await projectDataService.archiveProjects(user, children);
        // if(project.parentId) {
        //     const parent = await projectDataService.getProjectLatest(user, project.parentId);
        //     updated.push(parent);
        //     await projectDataService.changeParent(user, project, null);
        // }
        // updated = await projectDataService.ifHasChildren(updated);
        // return updated;
    //}

}

module.exports = new ProjectService();