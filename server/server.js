import express from 'express';
import { credentials } from './Config/config.js';
import PublicRoutes from './Routes/PublicRoutes.js';
import UserRoutes from './Routes/UserRoutes.js';
import IndustryRoutes from './Routes/IndustryRoutes.js';
import ArtistRoutes from './Routes/ArtistRoutes.js';
import VenueRoutes from './Routes/VenueRoutes.js';
import ShowrunnerRoutes from './Routes/ShowrunnerRoutes.js';
import ExternalRoutes from './Routes/ExternalRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './Middleware/ErrorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import secureHttp from 'https';
import {initializeSocket} from './Config/socket.config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const buildPath = path.normalize(path.join(__dirname + '/../build'));
const uploadPath = path.normalize(path.join(__dirname + '/../upload'));
const http = express();
const app = express();
const https = secureHttp.createServer(credentials, app);

app.use(bodyParser.json({ limit: '50mb' }));

console.log("Booting in " + process.env.NODE_ENV);
if (!process.env.NODE_ENV) {
    console.log("No environment specified. This is normally an issue with your .env file.\nExiting now")
    process.exit(1);
}

await initializeSocket(https)

http.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
});

app.use(cors());

app.use('/upload', express.static(uploadPath));

app.use('/.well-known', express.static(path.join(__dirname, "../")));

//Public routes that do not require authentication
app.use('/api/', PublicRoutes);

//Routes which require a user to be signed in
app.use('/api/user/', UserRoutes);

//Routes for INDustry professionals; this can be an artist or a venue.
app.use('/api/ind/', IndustryRoutes);

//Routes for signed in artists
app.use('/api/artist/', ArtistRoutes);

//Routes for signed in venue managers
app.use('/api/venue/', VenueRoutes);

//Routes for Showrunners
app.use('/api/sr/', ShowrunnerRoutes)

//External routes for Embeds
app.use('/api/e/', ExternalRoutes);

app.use(errorHandler);

//Serve app on frontend
app.use(express.static(buildPath));

app.get('*', async (req, res, next) => {
    res.sendFile(path.join(buildPath, 'index.html'));
 });

process.on('uncaughtException', (err, origin) => {
    console.log(
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`,
    );
});

http.listen(process.env.HTTP_PORT, process.env.SERVER_HOSTNAME);
https.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME, () => {
    console.log('App listening on port ' + process.env.SERVER_PORT + '!');
});

/*To Rewrite:
updateTicketSales
createUnclaimedUser
*/
