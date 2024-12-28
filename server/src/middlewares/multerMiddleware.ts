import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';


const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const directory = `../client/public/images`;

    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        cb(err, directory);
      } else {
        cb(null, directory);
      }
    });
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadSpeakerImage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 } 
});

export { uploadSpeakerImage };
