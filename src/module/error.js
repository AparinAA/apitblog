class BaseError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}

class BadRequestError extends BaseError {
    constructor(message) {
        super(400, message);
    }
}

class NotFoundError extends BaseError {
    constructor(message) {
        super(404, message);
    }
}

class UnauthorizationError extends BaseError {
    constructor(message) {
        super(403, message);
    }
}

class NotPermissionError extends BaseError {
    constructor(message) {
        super(406, message);
    }
}

export { BadRequestError, NotFoundError, NotPermissionError, UnauthorizationError }