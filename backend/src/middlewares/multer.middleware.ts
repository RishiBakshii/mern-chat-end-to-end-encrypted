import multer from 'multer'

export const upload = multer({
    limits:{fileSize:5*1024*1024}
})

