import {v2 as cloudinary} from 'cloudinary'
import { env } from '../schemas/env.schema.js'

cloudinary.config({
    cloud_name:env.CLOUDINARY_CLOUD_NAME,
    api_key:env.CLOUDINARY_API_KEY,
    api_secret:env.CLOUDINARY_API_SECRET
})