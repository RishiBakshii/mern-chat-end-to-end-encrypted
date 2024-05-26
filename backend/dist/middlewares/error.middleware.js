import { CustomError } from "../utils/error.utils.js";
import { ZodError } from "zod";
import jwt from 'jsonwebtoken';
import { MulterError } from "multer";
export const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    let message;
    let statusCode = 500;
    if (err instanceof ZodError) {
        message = (err.issues.map(issue => issue.message)).join(", ");
        statusCode = 400;
    }
    else if (err instanceof CustomError) {
        message = err.message;
        statusCode = err.statusCode;
    }
    else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
        if (err instanceof jwt.TokenExpiredError) {
            statusCode = 401;
            message = "Token expired, please login again";
        }
        if (err instanceof jwt.JsonWebTokenError) {
            statusCode = 401;
            message = "Invalid Token, please login again";
        }
        if (err instanceof MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                statusCode = 400;
                message = 'Too many files uploaded. Maximum 5 files allowed.';
            }
        }
    }
    else {
        return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(statusCode).json({ message });
};
//# sourceMappingURL=error.middleware.js.map