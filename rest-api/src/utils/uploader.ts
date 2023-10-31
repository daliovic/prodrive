import path from 'path';
import multer from 'multer';
import { CONSTANTS } from '@/configs/constants';

const filesUploadDir = CONSTANTS.filesUploadDir;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'audio/mpeg' && file.mimetype !== 'video/mp4') {
      return cb(null, false);
    }
    cb(null, true);
  },
});
