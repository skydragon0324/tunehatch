import Jimp from 'jimp';
import { ACCEPTED_FILETYPES } from '../Config/config.js';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync, renameSync } from 'fs';
import { sendEmail } from './commsService.js';
import { PUBLICURL } from '../Config/config.js';
import { QRCodeStyling } from "qr-code-styling-node/lib/qr-code-styling.common.js";
import { ticketTimestamp } from '../../src/Helpers/shared_dist/ticketTimestamp.js';
import nodeCanvas from "canvas";
import { generateQROptions } from '../../src/Helpers/shared_dist/qrOptions.js';
import { uploadPath, relativeUploadPath } from '../Config/config.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function verifyUpload(file) {
        let checked = true;
        const extname = ACCEPTED_FILETYPES.test(path.extname(file.originalname).toLowerCase());
        const mimetype = ACCEPTED_FILETYPES.test(file.mimetype);
        if (!mimetype || !extname) {
           checked = false;
        }
        console.log(checked)
        return checked;
}

export function determineUploadPaths(type, id, subdirectory) {
    try {
       if (!subdirectory) {
          subdirectory = ''
       }
       const baseDir = path.join(__dirname + "/../../");
       const displayDir = path.join(
          process.env.IMAGE_UPLOAD_DIR + "/" + type + "/" + id +  "/" + subdirectory
       );
       const targetDir = path.join(baseDir, displayDir);
       if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true })
       }
       let paths = {
          targetDir,
          displayDir
       }
       return paths;
    } catch (err) {
       console.log(err)
       return false;
    }
 }

 export async function  uploadBaseImage(img, directory, id, name, extension, knownPath) {
    try {
       const paths = determineUploadPaths(directory, id);
       const targetDir = paths.targetDir;
       const displayDir = paths.displayDir;
       extension = extension || "png"
       const filename = '/' + name + "." + extension
       const uploadPath = targetDir + filename;
       const resultPath = displayDir + filename;
       // strip off the data: url prefix to get just the base64-encoded bytes
       const data = img.replace(/^data:([A-Za-z-+/]+);base64,/, '');
       writeFileSync(uploadPath, data, { encoding: 'base64' });
       return resultPath;
    } catch (err) {
       console.log(err);
       return false
    }
 }

export async function createTicketImage(ticketID, show, venue, uid, email, tier_info, timezone) {
   var targetDir;
   var displayDir;
   if (uid) {
      let paths = await determineUploadPaths("user", uid, "tickets/");
      targetDir = paths.targetDir;
      displayDir = paths.displayDir;
   }
   try {
      const title = await Jimp.loadFont(path.normalize(__dirname + "/../Assets/INTER_WHITE_64_LIGHT/INTER_WHITE_64_LIGHT.fnt"));
      const bold = await Jimp.loadFont(path.normalize(__dirname + "/../Assets/INTER_WHITE_32_MED/INTER_WHITE_32_MED.fnt"));
      const font = await Jimp.loadFont(path.normalize(__dirname + "/../Assets/INTER_WHITE_32_LIGHT/INTER_WHITE_32_LIGHT.fnt"));
      const finePrint = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
      const venueTimezone = timezone;
      //todo: custom ticket backgrounds
      let suffix = ticketID + ".png";
      let displayTmpPath = path.normalize(relativeUploadPath + "/tmp/") + ticketID + ".jpg"
      let tmpPath = path.normalize(uploadPath + "/tmp/") + ticketID + ".jpg"
      let destination = uid ? path.normalize(targetDir) + suffix : tmpPath
      let displayDestination = uid ? path.normalize(displayDir) + suffix : displayTmpPath
      let width = 780;
      let height = 1600;
      let textPos = {
         x: 0,
         y: 0,
         yPad: 40,
         xPad: 10
      };
      //qr code generation
      const options = {
         ...generateQROptions(),
         width: 300,
         height: 300,
         data: PUBLICURL + "/e/ts/" + venue._key + "/" + show._key + "/" + ticketID,
         image: path.normalize(__dirname + "/../Assets/ChickLogo.png")
      }

      // For canvas type
      const qrCodeImage = new QRCodeStyling({
         nodeCanvas,
         ...options
      });

      let buffer = await qrCodeImage.getRawData("png");
      const QRCode = await Jimp.read(buffer);
      const logoSource = await Jimp.read(path.normalize(__dirname + "/../Assets/") + "TicketLogo.png")
      const ticketImg = await Jimp.read(!show.th_ticket_background ? path.normalize(__dirname + "/../Assets/") + "PurpleTicketBackground.jpeg" : show.th_ticket_background)
      ticketImg.resize(width, height)
      ticketImg.quality(70)
      //Insert Logo. TicketLogo is 400x80
      //Assuming width of 780, centered
      //780 - 400 = 380; 380/2 = 190
      ticketImg.composite(logoSource, 190, 200)
      textPos.y = textPos.y + 290;
      ticketImg.print(title, 25, textPos.y, {
         text: "TICKET",
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y;
      });
      //QR code
      textPos.y = textPos.y + 100;
      ticketImg.composite(QRCode, 240, textPos.y);
      textPos.y = textPos.y + 400;
      //location
      ticketImg.print(bold, 25, textPos.y, {
         text: "LOCATION",
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      ticketImg.print(font, 25, textPos.y, {
         text: venue.location.address.toUpperCase(),
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      ticketImg.print(font, 25, textPos.y, {
         text: venue.location.city.toUpperCase() + " " + venue.location.state.toUpperCase(),
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      //date/time
      let showStart = ticketTimestamp(show.starttime, venueTimezone)
      textPos.y = textPos.y + textPos.yPad;
      ticketImg.print(bold, 25, textPos.y, {
         text: "DATE " + showStart.date,
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      ticketImg.print(bold, 25, textPos.y, {
         text: "TIME " + showStart.time,
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      // lineup
      textPos.y = textPos.y + textPos.yPad;
      ticketImg.print(bold, 25, textPos.y, {
         text: show.th_type === "show" ? "ORGANIZED BY" : "LINEUP",
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      //get performer names, print
      let maxPerformers = 5;
      Object.keys(show.performers).forEach((key, i) => {
         if (i + 1 < maxPerformers) {
            let name = show.performers[key].name;
            if (name) {
               ticketImg.print(font, 25, textPos.y, {
                  text: name.toUpperCase(),
                  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
               }, width - 25, height, (err, image, { y }) => {
                  textPos.y = y + 2;
               });
            } else {
               ticketImg.print(font, 25, textPos.y, {
                  text: "A SECRET PERFORMER",
                  alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
               }, width - 25, height, (err, image, { y }) => {
                  textPos.y = y + 2;
               });
            }
         }
      })
      if (show.performers?.length > maxPerformers) {
         ticketImg.print(font, 25, textPos.y, {
            text: "...AND MORE",
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
         }, width - 25, height, (err, image, { y }) => {
            textPos.y = y + 2;
         });
      }
      //tier
      textPos.y = textPos.y + textPos.yPad + 50
      ticketImg.print(font, 25, textPos.y, {
         text: tier_info.name,
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      //fluff
      textPos.y = textPos.y + textPos.yPad
      ticketImg.print(font, 25, height - 150, {
         text: "THIS IS YOUR TICKET. ENJOY THE " + (show.th_type || "SHOW").toUpperCase(),
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height, (err, image, { y }) => {
         textPos.y = y + 2;
      });
      //ticket ID at footer
      ticketImg.print(finePrint, 25, height - 50, {
         text: "TID" + ticketID,
         alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, width - 25, height);
      await ticketImg.writeAsync(path.normalize(uploadPath + "/tmp/") + ticketID + ".jpg")
      if (uid) {
         await renameSync(tmpPath, destination)
         return displayDestination
      } else {
         return displayDestination
      }
   } catch (err) {
      console.log(err);
      sendEmail('ERROR', "reece@occident.us", { error: err, route: "createTicketImage" })
      return "/"
   }
 }
