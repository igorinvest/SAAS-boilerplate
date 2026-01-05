const { DataTypes } = require('./sequelize');
const commonService = require('../common-service');

module.exports.attributes = {
    //Company
    company: {
        companyId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        domain: {
            type: DataTypes.STRING,
            // allowNull: false,
            // validate: {
            //     notNull: true,
            // }
        },
        companyName: {
            type: DataTypes.STRING
        },
        config: {
            type: DataTypes.JSONB//all users are admins: true/false
        },
    },
    //User
    user: {
        userId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    userCompanies: {
        userCompanyId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        email: {
            type: DataTypes.STRING,
            // allowNull: false,
            // validate: {
            //     isEmail: true,
            //     notNull: true,
            // }
        },
        userId: {
            type: DataTypes.STRING,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notNull: true,
            },
            defaultValue: false
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAccepted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    //Folder
    folder: {
        name: {
            type: DataTypes.STRING
        },
        // restrictedAccess: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     validate: {
        //         notNull: true,
        //     },
        //     defaultValue: false
        // },
    },
    //Project
    project: {
        projectId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        projectName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        publishDate: {
            type: DataTypes.DATE
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    externalProject: {
        externalProjectId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        role: {
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notNull: true,
                isIn: [['BOOKMARK', 'READ', 'WRITE']],
            },
        },
    },
    //Team
    team: {
        teamId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        //Parent team here
        name: {
            type: DataTypes.STRING
        },
        teamUsers: {
            type: DataTypes.JSONB
        }
    },

    //Temp links
    tempLink: {
        linkType: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false,
            validate: {
                isIn: [['login']],
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notNull: true,
            }
        },
        linkRef: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false
        },
        verificationCode: {
            type: DataTypes.STRING(6),
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    //Tokens
    token: {
        refreshToken: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
    },
    //Invitation
    invitation: {
        invitationId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notNull: true,
            }
        },
    },
    //Diagram
    diagram: {
        type: {
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notNull: true,
                isIn: [['MERMAID', 'BPMN', 'DRAWFLOW', 'DOCUMENT', 'TEST', 'ARTICLE']],
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        diagramId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            //defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        storageNodeId: {
            type: DataTypes.STRING(24),
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        position: {
            type: DataTypes.INTEGER,
        },
    },
    search: {
        searchId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        sourceChanged: {
            type: DataTypes.DATE,
        },
        language: {
            type: DataTypes.STRING(24),
        },
        text: {
            type: DataTypes.TEXT,
        },
        fts: {
            type: DataTypes.TSVECTOR,
        },
        embedding: {
            type: DataTypes.VECTOR(1536)
        }
    },
    //Content
    content: {
        content: {
            type: DataTypes.JSONB,
        },
        stringContent: {
            type: DataTypes.TEXT,
        },
        additionalDescriptionContent: {
            type: DataTypes.JSONB,
        },
        editCounter: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },

    //Storage
    storage: {
        storageId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            //defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
    },
    storageUpdate: {
        storageUpdateId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        version: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        state: {
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notNull: true,
                isIn: [['DRAFT', 'CANCELLED', 'MERGED']],
            },
        },
        data: {
            type: DataTypes.JSONB,
        },
    },
    //Storage folder
    storageFolder: {
        storageFolderId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        name: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
    },
    //Storage Node
    storageNode: {
        storageNodeId: {
            type: DataTypes.STRING(24),
            //defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        type: {
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notNull: true,
                isIn: [['MERMAID', 'BPMN', 'DOCUMENT', 'TEST']],
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        idVersion: {
            type: DataTypes.STRING(34),
            primaryKey: true,
            allowNull: false,
            unique: true,
            validate: {
                notNull: true,
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        nodeLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
    },
    //Article node
    articleNode: {
        articleNodeId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            },
        },
        type: {//So type could just be joined, but I was lazy to update the queries
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notNull: true,
                isIn: [['MERMAID', 'BPMN', 'DOCUMENT', 'TEST']],
            },
        },
        storageNodeId: {//this is basically a foreign key to view_storageNodeMaxVersion. Which is not a primary key by definition
            type: DataTypes.STRING(24),
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        nodeLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
    },
    //File
    file: {
        fileId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            unique: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        fileType: {
            type: DataTypes.STRING(10)
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        size: {
            type: DataTypes.INTEGER
        },
    },
    fileLink: {
        fileLinkId: {
            type: DataTypes.STRING(24),
            primaryKey: true,
            unique: true,
            defaultValue: commonService.generateId,
            allowNull: false,
            validate: {
                notNull: true,
            }
        },
        //Not a foreign key in storage nodes, so normal way doesn't work
        storageNodeId: {
            type: DataTypes.STRING(24),
        }
    }
}

