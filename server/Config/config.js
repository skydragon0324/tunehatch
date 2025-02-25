import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/*Global Config*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.normalize(path.join(__dirname + '/../../upload'));
const relativeUploadPath = path.normalize("/" + process.env.IMAGE_UPLOAD_DIR);
const ACCEPTED_FILETYPES = /jpeg|jpg|png|gif|heic/;
const PUBLICURL = process.env.REACT_APP_PUBLIC_URL;
// should this maybe be in server?
const SSLKEY = readFileSync(process.env.SSL_KEY_FILE, 'utf8');
const SSLCRT = readFileSync(process.env.SSL_CRT_FILE, 'utf8');
const CA = readFileSync(process.env.SSL_PEM_FILE, 'utf8');
const JWTPRIV = readFileSync('server/Config/jwt/' + process.env.NODE_ENV + '/jwtRS256.key', 'utf8');

const credentials = {
        key: SSLKEY,
        cert: SSLCRT,
        ca: CA
}

export { credentials, SSLKEY, SSLCRT, CA, JWTPRIV, PUBLICURL, ACCEPTED_FILETYPES, uploadPath, relativeUploadPath }