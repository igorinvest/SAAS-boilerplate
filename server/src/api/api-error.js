module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors.map(e => {return e.msg});
    }

    static UnauthorizedError(message, errors = []) {
        return new ApiError(401, message, errors);
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static ServerError(message, errors = []) {
        return new ApiError(500, message, errors);
    }
}
