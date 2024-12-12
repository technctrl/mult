import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadFile = (folder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, '../../../', 'uploads', folder);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = file.originalname.split('.').pop()
      cb(null, file.fieldname + '-' + uniqueSuffix+"."+extension);
    }
  });

  return multer({ storage });
};

export default uploadFile;
