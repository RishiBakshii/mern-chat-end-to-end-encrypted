import multer from 'multer';
import { MAX_FILE_SIZE } from '../constants/file.constant.js';
import { v4 as uuidV4 } from 'uuid';
export const upload = multer({
    limits: { fileSize: MAX_FILE_SIZE },
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const uniqueMiddleName = uuidV4();
            const newFileName = `${userId}-${uniqueMiddleName}-${file.originalname}`;
            cb(null, newFileName);
        }
    })
});
//# sourceMappingURL=multer.middleware.js.map