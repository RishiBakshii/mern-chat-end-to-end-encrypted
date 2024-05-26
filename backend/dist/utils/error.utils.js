export class CustomError extends Error {
    constructor(message = 'Interval Server Error', statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const asyncErrorHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
