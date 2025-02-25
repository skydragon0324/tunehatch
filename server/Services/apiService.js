import axios from 'axios';
import Stripe from 'stripe';
import { PUBLICURL } from '../Config/config.js';
import querystring from 'querystring'
import { verifyCartTotal } from './DBServices/dbService.js';
import { calculateCartTotal } from '../../src/Helpers/shared_dist/calculateCartTotal.js';
import { getSingleDocument, addStripeID, confirmStripeID } from './DBServices/dbHelperService.js';
const stripe = (Stripe)(process.env.STRIPE_PRIVATE);
const spotifySecret = process.env.SPOTIFY_SECRET;
const spotifyClient = process.env.SPOTIFY_CLIENT;

/**
 * createStripe
 * Creates Stripe account
 * @param {str} viewType Account type: either "artist" or "venue"
 * @param {key} targetID SRID, venueID, or uid
 * @returns stripeID
 */
export async function createStripe(viewType, targetID) {
    try {
        const account = await stripe.accounts.create({ type: 'express' });
        if (account.id) {
            addStripeID(viewType, targetID, account.id);
        } else {
            throw new Error("STRIPE_INVALID")
        }
        return account.id;
    } catch (err) {
        throw err
    }
}

/**
 * getStripe
 * Gets stripe Account Link
 * @param {str} viewType
 * @param {str} stripeID
 * @param {key} targetID Venue, SRID, or UID
 * @returns Account Link
 */
export async function getStripe(viewType,
    stripeID,
    targetID
    ) {
    try {
        var accountLink;
        var redirectLink;
        var targetID;
        switch (viewType) {
            case "artist":
                redirectLink = `${PUBLICURL}/profile/u/${targetID}`
                break;
            case "venue":
                redirectLink = `${PUBLICURL}/profile/v/${targetID}`
                break;
            case "showrunner":
                redirectLink = `${PUBLICURL}/profile/g/${targetID}`
                break;
        }
        if (!stripeID) {
            stripeID = await confirmStripeID(viewType, targetID)
            if (!stripeID) {
                stripeID = await createStripe(viewType, targetID);
            }
        }
        const account = await stripe.accounts.retrieve(stripeID);
        if (account.payouts_enabled) {
            accountLink = {
                url: "https://connect.stripe.com/app/express"
            }
        } else {
            accountLink = await stripe.accountLinks.create({
                account: stripeID,
                refresh_url: redirectLink,
                return_url: redirectLink,
                type: 'account_onboarding',
            });
        }
        return accountLink;
    } catch (err) {
        console.log(err)
        throw err
    }
}


/**
 * getVideoLink
 * Gets full URL of embedded link
 * @param {link} link Link of Video
 */
export async function getVideoLink(link) {
    try {
        const result = await axios.get(link);
        let tempLink = result.request.res.responseUrl;
        return tempLink.replace("à", "@");
    } catch (err) {
        throw err;
    }
    // return resul;
}

export async function setPaymentIntent(showID, cart, email, useDoorPrice, intentID) {
    try {
        //todo: dynamically change door price after starttime, instead of relying on honesty.
        const show = await getSingleDocument("shows", showID);
        //confirm price of each ticket tier
        const verified = await verifyCartTotal(showID, cart, useDoorPrice);
        if (!verified) {
            throw new Error("CART_NOT_VERIFIED")
        }
        const total = calculateCartTotal(cart).stripeTotal
        const showName = show.name;
        var ticketTypes = showName;
        Object.keys(cart).forEach((item) => {
            if (cart[item].quantity > 0) {
                ticketTypes = ticketTypes + " " + cart[item].quantity + "x $" + cart[item].price + " tickets"
            }
        })
        let intentObj = {
            amount: total,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            receipt_email: email,
            description: ticketTypes
        }
        let updateObj = {
            amount: total,
            receipt_email: email,
            description: ticketTypes
        }
        if (!email) {
            delete intentObj.receipt_email;
            delete updateObj.receipt_email;
        }
        const paymentIntent = intentID ?
            await await stripe.paymentIntents.update(intentID, updateObj)
            : await stripe.paymentIntents.create(intentObj)
        return ({ id: paymentIntent.id, secret: paymentIntent.client_secret });
    } catch (err) {
        throw err;
    }
}

export async function getStripeIntent(intentID) {
    return await stripe.paymentIntents.retrieve(intentID);
}

/**
 * getInstagramToken
 * Swaps Instagram access code for a token.
 * @param {code}
 */
export async function getInstagramToken(code) {
    try {
        const result = await axios.post("https://api.instagram.com/oauth/access_token",
            querystring.stringify({
                client_id: "675289627441317",
                client_secret: process.env.INSTAGRAM_PRIVATE,
                grant_type: "authorization_code",
                redirect_uri: PUBLICURL + "/auth/",
                code: code
            }));
        const longToken = await getInstagramLongToken(result.data.access_token);
        return longToken;
    } catch (err) {
        throw err;
    }
}

export async function getInstagramLongToken(shortToken) {
    try {
        const result = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_PRIVATE}&access_token=${shortToken}`)
        return result.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * get Spotify Access Token
 */
export async function getSpotifyToken() {
    try {
        const data = {
            grant_type: 'client_credentials',
            client_id: spotifyClient,
            client_secret: spotifySecret,
        };
        const tokenResponse = await axios.post("https://accounts.spotify.com/api/token",
            querystring.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'application/json',
                    'Authorization': `Basic ${new Buffer.from(`${spotifyClient}:${spotifySecret}`).toString("base64")}`
                }
            });
        const accessToken = tokenResponse.data['access_token'];
        return accessToken;
    } catch (err) {
        console.log('error:', err);
        throw err;
    }
}
/**
 * generateTerminalToken
 * Generates a Stripe Terminal token for use in the POS system.
 */
export async function generateTerminalToken(){
    const connectionToken = await stripe.terminal.connectionTokens.create();
    return connectionToken
}


/**  
 * getStripeStatus
 * Retrieves whether or not a user is eligible to receive payments.
 * @param {str} accountID User's Stripe Connect account ID
 * @param {_key} id (optional) If accountID is unknown, use venueID or userID to retrieve it
 * @param {str} type (optional) "venue" || "user"
 * @returns {Object: {status: bool}}
*/
export async function getStripeStatus(accountID, id, type) {
    try {
        if (!accountID && id && type) {
            let result;
            if (type === "user" || type === "artist") {
                result = await getSingleDocument("users", id);
            } else if (type === "venue") {
                result = await getSingleDocument("venues", id);
            }else if(type === "showrunner"){
                result = await getSingleDocument("showrunners", id)
            }
            accountID = result?.stripe?.id
        }
        if (accountID) {
            const account = await stripe.accounts.retrieve(accountID);
            if (account.payouts_enabled) {
                return { status: true }
            } else {
                return { status: false }
            }
        }
        return { status: false };
    } catch (err) {
        throw err;
    }
}

/**
 * stripeTransfer
 * Initiates a Stripe transfer
 * @param {str} accountID Stripe Account ID;
 * @param {Number} amount Amount in cents
 * @param {str} description Description of transfer
 */
export async function stripeTransfer(accountID, amount, description) {
    const transfer = await stripe.transfers.create({
        amount: amount,
        currency: 'usd',
        destination: accountID,
        description: description
    });
    return transfer;
}
