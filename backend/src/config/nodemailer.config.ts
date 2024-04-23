import nodemailer from 'nodemailer'
import { env } from '../schemas/env.schema.js'

let transporter : nodemailer.Transporter

try {
    transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:env.EMAIL,
            pass:env.PASSWORD
        }
    })
} catch (error) {
    console.log(error);
}

export {
    transporter
}

