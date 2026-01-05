module.exports = class UserDto {
    userName;
    email;
    userId;
    isActivated;
    companyId;
    isAdmin;

    constructor(model) {
        this.userName = model.userName;
        this.email = model.email;
        this.userId = model.userId;
        this.isActivated = model.isActivated;
        this.companyId = model.companyId || '';
        this.isAdmin = model.isAdmin || false;
    }
}
