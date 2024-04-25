import multer from 'multer'
import { MAX_FILE_SIZE } from '../constants/file.constant.js'

export const upload = multer({
    limits:{fileSize:MAX_FILE_SIZE}
})

