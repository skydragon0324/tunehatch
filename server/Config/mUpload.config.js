import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mUpload = multer({ dest: __dirname + '/../..' + process.env.IMAGE_UPLOAD_DIR + "tmp" });
