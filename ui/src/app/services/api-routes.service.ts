import { ProjectModel } from "../product/company/project/project.model";
import { UserCompanyModel } from "./models/user-company.model";
import { UserModel } from "./models/user.model";

export const ApiRoutes = {

    //User
    '/renameUser': {
        auth: true,
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'userName',
                source: 'bodyField',
            }
        ],
        model: UserModel
    },
    '/getUser': {
        method: 'GET',
        parseCookies: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
        model: UserModel
    },
    '/refresh': {
        auth: false,
        method: 'GET',
        parseCookies: true,
        params: [
            {
                name: 'refreshToken',
                source: 'cookies'
            }
        ],
    },
    '/googleAuth': {
        auth: false,
        method: 'POST',
        parseCookies: true,
        params: [
            {
                name: 'googleData',
                source: 'body'
            }
        ],
    },
    '/logout': {
        method: 'GET',
        parseCookies: true,
        function: 'logout', //fix needed, should return auth token
        params: [
            {
                name: 'refreshToken',
                source: 'cookies'
            }
        ],
        removeRefreshToken: true
    },
    '/loginWithLink': {
        auth: false,
        method: 'POST',
        params: [
            {
                name: 'loginLinkRef',
                source: 'bodyField'
            },
            {
                name: 'pinCode',
                source: 'bodyField'
            }
        ],
        setRefreshToken: true
    },
    '/sendLoginLink': {
        auth: false,
        method: 'POST',
        params: [
            {
                name: 'email',
                source: 'bodyField'
            }
        ]
    },

    //Company
    '/getCompany': {
        method: 'GET',
        params: [
            {
                name: 'user',
                source: 'userObject'
            }
        ],
    },
    '/createCompany': {
        auth: true,
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'companyName',
                source: 'bodyField',
            }
        ],
        model: UserCompanyModel,
        isArray: true
    },

    //User Company Admin
    '/updateUserCompany': {
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'userModel',
                source: 'body'
            },
        ],
        model: UserCompanyModel,
    },
    '/updateCompany': {
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'updatedCompany',
                source: 'body'
            }
        ],
        model: UserCompanyModel,
        isArray: true,
    },

    //UserCompany
    '/inviteToCompany': {
        auth: true,
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'email',
                source: 'bodyField'
            }
        ],
        model: UserModel,
        isArray: true
    },
    '/getUserCompanies': {
        method: 'GET',
        parseCookies: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
        model: UserCompanyModel,
        isArray: true,
    },
    '/acceptCompanyInvitation': {
        auth: true,
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'userCompanyId',
                source: 'bodyField',
            }
        ],
        setRefreshToken: true,
        model: UserCompanyModel,
        isArray: true
    },
    '/activateCompany': {
        auth: true,
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'userCompanyId',
                source: 'bodyField',
            }
        ],
        model: UserCompanyModel,
        isArray: true
    },
    '/getAllUsers': {
        method: 'GET',
        parseQuery: false,
        params: [
            {
                name: 'user',
                source: 'userObject'
            }
        ],
        model: UserModel,
        isArray: true
    },

    //Project
    '/updateProject': {
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'project',
                source: 'body'
            }
        ],
        model: ProjectModel,
        isArray: true
    },
    '/getProjects': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
        model: ProjectModel,
        isArray: true
    },
    '/getProject': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'projectId',
                source: 'query'
            },
        ],
        model: ProjectModel,
    },
    '/createProject': {
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'project',
                source: 'body'
            }
        ],
        model: ProjectModel
    },
    '/changeParentProject': {
        method: 'POST',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'projectId',
                source: 'bodyField'
            },
            {
                name: 'parentId',
                source: 'bodyField'
            }
        ],
        model: ProjectModel,
        isArray: true
    },
    '/deleteProject': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'projectId',
                source: 'query'
            },
        ],
        model: ProjectModel,
        isArray: true
    },

    //External Project
    '/getExternalProjects': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
        model: ProjectModel,
        isArray: true
    },
    '/addProjectBookmark': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'projectId',
                source: 'query'
            },
        ],
        model: ProjectModel,
        isArray: true
    },
    '/deleteExternalProject': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'projectId',
                source: 'query'
            },
        ],
        model: ProjectModel,
        isArray: true
    },
    '/getExternalDiagram': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'diagramId',
                source: 'query'
            },
        ],
    },
    '/getExternalDiagrams': {
        method: 'GET',
        parseQuery: true,
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
    },

}
