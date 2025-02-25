import { createTransport } from 'nodemailer';
import { google } from "googleapis";
import { emailGenerator } from '../Models/Emails.js';
import twilio from 'twilio';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSingleDocument } from './DBServices/dbHelperService.js';
import { ticketTimestamp } from '../../src/Helpers/shared_dist/ticketTimestamp.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const twSid = process.env.TWILIO_SID;
const twToken = process.env.TWILIO_TOKEN;
const refreshToken = process.env.EMAIL_REFRESH_TOKEN
const clientID = process.env.EMAIL_CLIENT_ID
const clientSecret = process.env.EMAIL_CLIENT_SECRET
const basePath = path.normalize(path.join(__dirname + "/../../"))
const OAuth2 = google.auth.OAuth2;
var tw = null
if(twSid && twToken){
tw = (twilio)(twSid, twToken);
}

const oauth2Client = new OAuth2(
   clientID,
   clientSecret,
   "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
   refresh_token: refreshToken
});

const accessToken = oauth2Client.getAccessToken()

export function sendSMS(phone, message, link) {
   const messageWithLink = `${message} ${link}`;
   if(tw){
   tw.messages
      .create({
         to: phone,
         from: process.env.TWILIO_PHONE,
         body: messageWithLink,
      })
      .then(message => console.log(message.sid))
      .catch(err => console.log(err));
}
}

// Function to send follow-up message to the venue
export async function sendFollowUpMessageToVenue(venuePhone, followUpMessage) {
   console.log('User replied with YES!');
   if(tw){
      tw.messages
      .create({
         to: venuePhone,
         from: process.env.TWILIO_PHONE,
         body: followUpMessage,
      })
      .then(message => console.log(message.sid))
      .catch(err => console.log(err));
   }
}

export function sendEmail(usage, recipient, data, images) {
   const { subject, html } = emailGenerator(usage, data);
   var transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
         type: "OAuth2",
         user: "outreach@tunehatch.com",
         clientId: clientID,
         clientSecret: clientSecret,
         refreshToken: refreshToken,
         accessToken: accessToken
      }
   });
   //handling of ticket attachments
   var mailOptions;
   if (images) {
      mailOptions = {
         from: 'The TuneHatch Team <outreach@tunehatch.com>',
         to: recipient,
         subject: subject,
         html: html,
         attachments: images.map((ticket, i) => {
            return {
               filename: 'ticket' + (i + 1) + '.png',
               path: basePath + ticket.image
            };
         }),
      };
   } else if (!Array.isArray(recipient)) {
      mailOptions = {
         from: 'The TuneHatch Team <outreach@tunehatch.com>',
         to: recipient,
         subject: subject,
         html: html,
      };
   } else {
      mailOptions = {
         from: 'The TuneHatch Team <outreach@tunehatch.com>',
         bcc: recipient,
         subject: subject,
         html: html,
      };
   }
   if (process.env.NODE_ENV === 'production' && usage === 'ERROR') {
      transporter.sendMail(mailOptions, function (err, info) {
         if (err) {
            console.log(err);
         } else {
            console.log('Email sent: ' + info.response);
         }
      });
   }
   if (usage !== 'ERROR') {
      transporter.sendMail(mailOptions, function (err, info) {
         if (err) {
            console.log(err);
         } else {
            console.log('Email sent: ' + info.response);
         }
      });
   }
}

export async function sendStripeReminderEmail(uid, showID) {
   //todo: add support for different types
   try {
      const user = await getSingleDocument("users", uid);
      const show = await getSingleDocument("shows", showID);
      const venue = await getSingleDocument("venues", show.venueID);
      const email = user.email;
      const name = user?.type?.artist?.stagename ? user.type.artist.stagename : user.firstname + " " + user.lastname;
      const venueName = venue.name;
      const showDate = (ticketTimestamp(show.starttime, data.venueTimezone || "America/Chicago")).date;
      const showName = show.name;
      sendEmail("STRIPE_REMINDER", [email, "info@tunehatch.com"], { name, venueName, showDate, showName })
   } catch (err) {
      throw err;
   }
}
