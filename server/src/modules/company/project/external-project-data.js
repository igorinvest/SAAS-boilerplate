const {ExternalProjectModel} = require('../../../models/models');
const { sequelize } = require('../../../models/sequelize');

module.exports.externalProjectData = new class ExternalProjectData {

    async getExternalProjects(user) {
        const externalProjects = await sequelize.query(`
            select
                e.*,
                p."projectName",
                p."isPublic",
                p."publishDate",
                c."companyId",
                c."companyName"
            from "externalProjects" e
                left join projects p on p."projectId" = e."projectId"
                left join companies c on p."companyId" = c."companyId"
                inner JOIN LATERAL
                    (
                        SELECT  d."diagramId"
                        FROM    diagrams d
                        WHERE   d."projectId" = p."projectId"
                        LIMIT 1
                    ) AS d ON true
            where
                e."userId" = :userId
                and p."isPublic" = true
                and c."companyId" <> :companyId
            order by p."publishDate" DESC;
            `,{
                replacements: { userId: user.userId, companyId: user.companyId || '' },
                type: sequelize.QueryTypes.SELECT,
                model: ExternalProjectModel,
            }
        );
        return externalProjects;
    }

    async addProjectBookmark(user, projectId) {
        const externalProject = await ExternalProjectModel.create({
            projectId: projectId,
            role: 'BOOKMARK',
            userId: user.userId
        });
        return externalProject;
    }

    async getProjectBookmark(user, projectId) {
        const externalProject = await ExternalProjectModel.findOne({ where: {
            projectId: projectId,
            role: 'BOOKMARK',
            userId: user.userId
        }});
        return externalProject;
    }

    async getExternalProject(user, projectId) {
        const externalProject = await ExternalProjectModel.findOne({
            where: {
                projectId: projectId,
                userId: user.userId
            }
        });
        return externalProject;
    }

}

