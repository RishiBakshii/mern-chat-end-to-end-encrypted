import nodemailer from 'nodemailer';
import { env } from '../schemas/env.schema.js';
let transporter;
try {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL,
            pass: env.PASSWORD
        }
    });
}
catch (error) {
    console.log(error);
}
export { transporter };
//# sourceMappingURL=nodemailer.config.js.map