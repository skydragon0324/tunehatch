import { ticketTimestamp } from "../../src/Helpers/shared_dist/ticketTimestamp.js";
import { PUBLICURL } from "../Config/config.js";

export function emailGenerator(type, data) {
   var subject;
   var html;
   switch (type) {
      case 'TICKET_PURCHASE':
         subject = 'Your TuneHatch Tickets for ' + data.showName;
         html =
            `
              <h1>You've got ${data.quantity === 1 ? 'ticket!' : 'tickets!'}</h1>
              <p>This email is to confirm your recent ticket purchase for ` + data.showName + `.</p> 
              <p>Attached ${data.quantity > 1 ? 'are your tickets.' : 'is your ticket.'} Enjoy the show!</p>
           `;
         break;
      case 'PASSWORD_RESET':
         subject = 'TuneHatch Password Reset';
         html = `
          <h1>Reset Password</h1>
          <p>Hello! You are receiving this email because we receieved a password reset request for the TuneHatch account ${data.email}. <br/>
          If you did not request this reset, you do not have to take any action and may use the tickets you have already received.
          <p>If this request was made by you, <a href="${process.env.REACT_APP_PUBLIC_URL}/reset-password/${data.reset_token}" target="_blank">click here to change your password</a><br/>
          This link will expire in fifteen minutes.</p>
          <p>Thanks<br/>The TuneHatch Team</p>`;
         break;
      case 'RESCHEDULE_NOTICE':
         subject = data.showName + " has been rescheduled"
         html =
            `
              <h1>${data.showName} has been rescheduled</h1>
              <p>Hello! You are receiving this email because you purchased tickets to ${data.showName}.<br/>
              The venue has informed us that the event will now be held on ${data.newTime}. <br/>
              If you cannot make this new showtime, please reach out to us at <a href="mailto:info@tunehatch.com">info@tunehatch.com</a> to begin a refund claim.</p>
           `;
         break;
      case 'CLAIM_ARTIST':
         let startTimestamp = data?.show?.starttime ? ticketTimestamp(data.show.starttime, data.venueTimezone || "America/Chicago") : "Unspecified";
         let endTimestamp = data?.show?.endtime ? ticketTimestamp(data.show.endtime, data.venueTimezone || "America/Chicago") : "Unspecified";
         let showStart = startTimestamp?.time;
         let showEnd = endTimestamp?.time;
         subject = "You have been added to a show on TuneHatch!"
         html =
            `
            <p>Hi ${data.name},<br/>
            <b>${data.venueName} has partnered with TuneHatch. </b> We're a community-driven platform built to champion the independent artists, venues, and showrunners that make this town great.<br/><br/>
            We see you have an upcoming show on ${data.showTime}. Here's the event/ticket link: <br/>
            <a href="${PUBLICURL + "/shows/" + data.showID}">${PUBLICURL + "/shows/" + data.showID}</a><br/></p>
            <p>
            Here's how to log in to TuneHatch and get paid out for the electronic tickets sold from your show at ${data.venueName}.<br/>
            1) Claim your pre-filled profile at <a href="${PUBLICURL + "/register/claim/" + data.claimCode}" target="_blank" rel="noreferrer"}>by clicking here</a><br/>
            2) Click "Manage Payouts" on your profile page<br/>
            3) Enter Info on Stripe - TuneHatch has partnered with Stripe for secure payments directly to your bank account<br/><br/>
            ${data.cohost ? `Co-Hosting<br/>
            Artist co-hosting is enabled. This means that <b>you</b> are able to update your:<br/>
            - Show Description<br/>
            - Flyer<br/>
            - Artist Lineup</br></br>
            To do this, log into TuneHatch, open the menu (your icon in the upper right hand corner), and press Manage Shows. Tap on the show, select Manage Show -> Edit Show, and you're on your way to updating your show.
            <br/><br/>` : ''}
            Other info you should know:<br/>
            TuneHatch does NOT take any money from artists' ticket sales<br/>
            Payment processing takes 3-5 days<br/>
            Make the profile your own! You can add various social media and a bio to let people know about you and your music.<br/>
            If you have any questions, please reach out at info@tunehatch.com or nick@tunehatch.com<br/><br/>

            ${data.boweryVault ?
               `
            Other venue specific confirmation details you should know about your upcoming show:<br/>
            The Bowery Vault — Even though we are licensed we stand for being an ORIGINAL MUSIC ONLY ESTABLISHMENT. Please, no cover songs.<br/>
            Date: ${data.showTime}<br/>
            Showtime:  ${showStart} - ${showEnd} (start - end) split three ways approximately 30 mins each act<br/>
            Load in: 30 minutes before show start<br/>
            <b>***DO NOT bring your own AMPS, DRUMS, DI Boxes or even mics (which we wipe down). No exceptions on size or tone. Must use our house gear. Our mics are preferred because we are completely dialed into our room and sound.</b><br/>
            Line check for first act: 15 mins before show start<br/>
            We line check one act at a time with stage curtains closed.<br/>
            Headliners, do not put your stuff on stage until it is your time to line check. Everyone can store instruments, pedal boards etc..back room.<br/>
            Please come prepared to line check with an original song while sound person works on levels. Please be patient and let them work on mains first. Once done, they will work on your monitors and ask you how you feel about your sound. Please keep singing while they work on your sound. Mic-check check check won't cut it. We take everyone's shows serious and want to bring you the best sound.<br/>
            Tip- just loop a verse or chorus if you're not wanting to give the whole song away.<br/>
            Please make sure everyone on bill promotes their show! With triple bills we ask that each artist brin at least 12 guests each. This is how we manage to not charge production fees and keep our doors open.<br/>
            2 item minimum per person<br/>
            We offer both alcoholic and alternative drinks.<br/>
            We are strictly 21+ for all shows. THIS INCLUDES ARTISTS. We ID everyone.<br/>
            NO PETS ALOWED INSIDE<br/>
            Bring QR codes for electronic tipping.<br/>
            All shows are free/ non- ticketed<br/>
            Our staff passes around the tip bucket. It's up to the artists to decide how to split tips amongst triple bills.<br/>
            Limited seating/ 49 max capacity<br/>
            TBV House Backline<br>
            1 Fender Champion solid state guitar amp<br/>
            1 Vox AC 15 tube guitar amp<br/>
            1 Ampeg SVT Classic 4x10 Bass amp<br/>
            Gretsch Catalina Club drum set. Missing 1 cymbal stand<br/>
            6 guitar stands<br/>
            2 music stands<br/>
            5 microphones<br/>
            4 mic stands<br/>
            Yamaha /weighted /88 keyboard<br/>
            If you have any questions about how to use TuneHatch please reach out at info@tunehatch.com and if you have questions about your show at The Bowery Vault, reach out to Vero at (646) 633-1821<br/>
            Thanks!<br/>
            TuneHatch and The Bowery Vault`
               : `Thanks!<br/>
               Nick`}
           </p>
               `;
         break;
         case 'CLAIM_SRG': 
         subject = "You have been added to a show as a promoter on TuneHatch!"
            html =
               `
               <p>Hi ${data.name},<br/>
               <b>Your promoter has partnered with TuneHatch. </b> We're a community-driven platform built to champion the independent artists, venues, and showrunners that make this town great.<br/><br/>
               <p>
               Here's how to log in to TuneHatch and get paid for shows you perform at<br/>
               1) Claim your pre-filled profile at <a href="${PUBLICURL + "/claim/register/" + data.claimCode}" target="_blank" rel="noreferrer"}>by clicking here</a><br/>
               2) Click "Manage Payouts" on your profile page<br/>
               3) Enter Info on Stripe - TuneHatch has partnered with Stripe for secure payments directly to your bank account<br/><br/>
               Other info you should know:<br/>
               TuneHatch does NOT take any money from artists' ticket sales<br/>
               Payment processing takes 3-5 days<br/>
               Make the profile your own! You can add various social media and a bio to let people know about you and your music.<br/>
               If you have any questions, please reach out at info@tunehatch.com or nick@tunehatch.com<br/><br/>
   
               ${data.boweryVault ?
                  `
               Other venue specific confirmation details you should know about your upcoming show:<br/>
               The Bowery Vault — Even though we are licensed we stand for being an ORIGINAL MUSIC ONLY ESTABLISHMENT. Please, no cover songs.<br/>
               Date: ${data.showTime}<br/>
               Showtime:  ${showStart} - ${showEnd} (start - end) split three ways approximately 30 mins each act<br/>
               Load in: 30 minutes before show start<br/>
               <b>***DO NOT bring your own AMPS, DRUMS, DI Boxes or even mics (which we wipe down). No exceptions on size or tone. Must use our house gear. Our mics are preferred because we are completely dialed into our room and sound.</b><br/>
               Line check for first act: 15 mins before show start<br/>
               We line check one act at a time with stage curtains closed.<br/>
               Headliners, do not put your stuff on stage until it is your time to line check. Everyone can store instruments, pedal boards etc..back room.<br/>
               Please come prepared to line check with an original song while sound person works on levels. Please be patient and let them work on mains first. Once done, they will work on your monitors and ask you how you feel about your sound. Please keep singing while they work on your sound. Mic-check check check won't cut it. We take everyone's shows serious and want to bring you the best sound.<br/>
               Tip- just loop a verse or chorus if you're not wanting to give the whole song away.<br/>
               Please make sure everyone on bill promotes their show! With triple bills we ask that each artist brin at least 12 guests each. This is how we manage to not charge production fees and keep our doors open.<br/>
               2 item minimum per person<br/>
               We offer both alcoholic and alternative drinks.<br/>
               We are strictly 21+ for all shows. THIS INCLUDES ARTISTS. We ID everyone.<br/>
               NO PETS ALOWED INSIDE<br/>
               Bring QR codes for electronic tipping.<br/>
               All shows are free/ non- ticketed<br/>
               Our staff passes around the tip bucket. It's up to the artists to decide how to split tips amongst triple bills.<br/>
               Limited seating/ 49 max capacity<br/>
               TBV House Backline<br>
               1 Fender Champion solid state guitar amp<br/>
               1 Vox AC 15 tube guitar amp<br/>
               1 Ampeg SVT Classic 4x10 Bass amp<br/>
               Gretsch Catalina Club drum set. Missing 1 cymbal stand<br/>
               6 guitar stands<br/>
               2 music stands<br/>
               5 microphones<br/>
               4 mic stands<br/>
               Yamaha /weighted /88 keyboard<br/>
               If you have any questions about how to use TuneHatch please reach out at info@tunehatch.com and if you have questions about your show at The Bowery Vault, reach out to Vero at (646) 633-1821<br/>
               Thanks!<br/>
               TuneHatch and The Bowery Vault`
                  : `Thanks!<br/>
                  Nick`}
              </p>
                  `;
            break;
      case 'STRIPE_REMINDER':
         subject = `Important: Set up payments for your show at ${data.venueName}`
         html = `
         Hi ${data.name},<br/>

<p>Woohoo! You are ready to claim your payout for your ${data.showDate} show at ${data.venueName}, ${data.showName}.<br/><br/>

To receive your payout:<br/>
1) Log into your TuneHatch account. If you haven't claimed your profile yet, check your emails for your profile claim code.<br/>
2) Click "Manage Payouts" on your profile page<br/>
3) Enter Information on Stripe - TuneHatch has partnered with Stripe for secure payments directly to your bank account<br/>
<br/>
Once your Stripe payout account is complete, you can monitor your payout via your profile under “manage payouts.” Please expect to receive your payout deposit in 3-5 days, after registering on Stripe.</br>
<br/>
If you do not receive your payout in 3-5 days after registering on Stripe, please contact info@tunehatch.com, and a customer service representative will be happy to assist you. <br/>
<br/>
Note: If the initiated payout differs from what you expected, please contact the venue for more information. Discrepancies may be due to changes in the lineup, production fee deductions, or other factors. *TuneHatch solely reports and processes payouts and does not have any bearing or influence on the amount transacted.*<br/>
<br/>
The TuneHatch Team</p>
`
         break;
      case 'PAYOUT_INITIATED':
         subject = `Payout for your show at ${data.venueName} initiated!`
         html = `
         Hi ${data.name},<br/>
         <br/>
         Woohoo! Your $${data.payoutAmount} payout has been initiated for your ${data.showDate} show at ${data.venueName}, ${data.showName}.<br/>
         <br/>
         You can monitor your payout via your profile under “manage payouts.” Please expect to receive your payout deposit in 3-5 days.<br/>
         <br/>
         If you do not receive your payout in 3-5 days, please contact info@tunehatch.com, and a customer service representative will be happy to assist you.<br/>
         <br/>
         Note: If the initiated payout differs from what you expected, please contact the venue for more information. Discrepancies may be due to changes in the lineup, production fee deductions, or other factors. *TuneHatch solely reports and processes payouts and does not have any bearing or influence on the amount transacted.*<br/>
         <br/>
         The TuneHatch Team         
         `
         break;
      case 'ERROR':
         subject = 'THERROR on ' + process.env.REACT_APP_PUBLIC_URL;
         html = `
        <h1>A Watched Error Occurred</h1>
        <p>
        The following error was generated on ${data.route}: <br/>
        ${data.error}
        </p>
        `
         break;
      default:
         return false;
   }
   return { subject, html }
}

