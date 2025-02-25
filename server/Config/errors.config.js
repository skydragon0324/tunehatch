export const ERROR_MAP = {
    "MULTIPLE_USERS": {
        message: "Multiple users have this login. Please contact the TuneHatch team at info@tunehatch.com",
        status: 501
    },
    "INVALID_TOKEN": {
        message: "Invalid token",
        status: 410
    },
    "FOR_FUN": {
        message: "This is used to test error messages.",
        status: 400
    },
    "UID_ERROR": {
        message: "User could not be authenticated. Please relog and try again.",
        status: 401
    },
    "PERMISSION_DENIED": {
        message: "You do not have the necessary permissions to perform this action. Please speak to the venue owner for access.",
        status: 401
    },
    "STRIPE_NOT_PROVIDED": {
        message: "",
        status: 401
    },
    "ALL_FIELDS_REQUIRED": {
        message: "",
        status: 401
    },
    "USER_ALREADY_EXISTS": {
        message: "This user already exists. Please log in or try again",
        status: 400
    },
    "INVALID_LOGIN":{
        message: "Incorrect username or password. Please try again",
        status: 401
    },
    "ACCOUNT_ERROR":{
        message: "Account error. Please contact us at info@tunehatch.com",
        status:500
    },
    "NO_ID_PROVIDED": {
        message: "No valid UID, venueID, or showID was provided. Please try again",
        status: 401
    },
    "CART_NOT_VERIFIED": {
        message: "Cart amount could not be verified. Please try again",
        status: 403
    },
    "LINEUP_LOCKED": {
        message: "This lineup is locked. Changes to this lineup may not be made until the venue unlocks this show's lineup.",
        status: 401
    }
}