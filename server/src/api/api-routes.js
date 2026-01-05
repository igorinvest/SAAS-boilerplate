const projectService = require('../modules/company/project/project-service');
const userService = require('../modules/user/user-service');
const {isEmail} = require('validator');
const { userCompanyService } = require('../modules/user/user-company-service');
const { externalProjectService } = require('../modules/company/project/external-project-service');
const { companyAdmin } = require('../modules/user/company-admin');
const companyService = require('../modules/company/company-service');

module.exports.routes = {

    //User
    '/renameUser': {
        auth: true,
        method: 'POST',
        service: userService,
        function: 'renameUser',
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
    },
    '/getUser': {
        method: 'GET',
        parseCookies: true,
        service: userService,
        function: 'getUser',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
    },
    '/refresh': {
        auth: false,
        method: 'GET',
        parseCookies: true,
        service: userService,
        function: 'refresh',
        params: [
            {
                name: 'refreshToken',
                source: 'cookies'
            }
        ],
        setAccessToken: true
    },
    '/googleAuth': {
        auth: false,
        method: 'POST',
        parseCookies: true,
        service: userService,
        function: 'googleAuth',
        params: [
            {
                name: 'googleData',
                source: 'body'
            }
        ],
        setRefreshToken: true,
        setAccessToken: true
    },
    '/logout': {
        method: 'GET',
        parseCookies: true,
        service: userService,
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
        service: userService,
        function: 'loginWithLink',
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
        service: userService,
        function: 'sendLoginLink',
        params: [
            {
                name: 'email',
                source: 'bodyField',
                validators: [
                    isEmail
                ]
            }
        ]
    },

    //Company
    '/getCompany': {
        method: 'GET',
        service: companyService,
        function: 'getCompany',
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
        service: userService,
        function: 'createCompany',
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
    },

    //User Company Admin
    '/inviteToCompany': {
        auth: true,
        checkAdminAccess: true,
        method: 'POST',
        service: companyAdmin,
        function: 'createInvitationOthers',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'email',
                source: 'bodyField',
                validators: [
                    isEmail
                ]
            }
        ]
    },
    '/updateUserCompany': {
        method: 'POST',
        checkAdminAccess: true,
        service: companyAdmin,
        function: 'updateUserCompany',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
            {
                name: 'updatedUserCompany',
                source: 'body'
            }
        ],
    },
    '/updateCompany': {
        method: 'POST',
        checkAdminAccess: true,
        service: companyAdmin,
        function: 'updateCompany',
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
    },
    
    //User Company not admin
    '/acceptCompanyInvitation': {
        auth: true,
        method: 'POST',
        service: userService,
        function: 'acceptCompanyInvitation',
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
        setRefreshToken: true
    },
    '/activateCompany': {
        auth: true,
        method: 'POST',
        service: userService,
        function: 'activateCompany',
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
    },
    '/getUserCompanies': {
        method: 'GET',
        parseCookies: true,
        service: userCompanyService,
        function: 'getUserCompanies',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
    },
    '/getAllUsers': {
        method: 'GET',
        parseQuery: false,
        service: userCompanyService,
        function: 'getAllUsers',
        params: [
            {
                name: 'user',
                source: 'userObject'
            }
        ],
    },

    //Project
    '/updateProject': {
        method: 'POST',
        service: projectService,
        function: 'update',
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
    },
    '/getProjects': {
        method: 'GET',
        parseQuery: true,
        service: projectService,
        function: 'getProjects',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
    },
    '/getProject': {
        method: 'GET',
        parseQuery: true,
        service: projectService,
        function: 'getProject',
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
    },
    '/createProject': {
        method: 'POST',
        service: projectService,
        function: 'create',
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
    },
    '/changeParentProject': {
        method: 'POST',
        service: projectService,
        function: 'changeParentProject',
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
    },
    '/deleteProject': {
        method: 'GET',
        parseQuery: true,
        service: projectService,
        function: 'deleteProject',
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
    },

    //External Project
    '/getExternalProjects': {
        method: 'GET',
        parseQuery: true,
        service: externalProjectService,
        function: 'getExternalProjects',
        params: [
            {
                name: 'user',
                source: 'userObject'
            },
        ],
    },
    '/addProjectBookmark': {
        method: 'GET',
        parseQuery: true,
        service: externalProjectService,
        function: 'addProjectBookmark',
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
    },
    '/deleteExternalProject': {
        method: 'GET',
        parseQuery: true,
        service: externalProjectService,
        function: 'deleteExternalProject',
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
    },
}
