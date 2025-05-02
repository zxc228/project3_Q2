const multer = require('multer');
const path = require('path');
const fs = require('fs');

// creating storage configuration function
const createStorage = (type) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), 'private', 'uploads', type);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `${type}-${uniqueSuffix}${extension}`);
    }
  });
};

// file size limits (in bytes)
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

// creating upload middleware for different document types
const academicRecordUpload = multer({ 
  storage: createStorage('academic_records'),
  limits: { fileSize: FILE_SIZE_LIMIT }
});

const cvUpload = multer({ 
  storage: createStorage('cvs'),
  limits: { fileSize: FILE_SIZE_LIMIT }
});

module.exports = {
  academicRecordUpload,
  cvUpload
};