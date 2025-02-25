// //This document prepares commonly used variables and environment settings for export.
// //Warn developers if the .env file is not being used
// function envCheck() {
//    if (!process.env.NODE_ENV) {
//       return false;
//    } else {
//       return true;
//    }
// }
// const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
// const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const ENVCHECK = envCheck();
// const IMAGE_URL = process.env.REACT_APP_IMAGE_URL + ":" + process.env.REACT_APP_SERVER_PORT;
// const SERVER_URL = process.env.REACT_APP_SERVER_URL + ":" + process.env.REACT_APP_SERVER_PORT;
// const APIURL = SERVER_URL + "/api/";
// const STRIPE_PUBLIC = process.env.REACT_APP_STRIPE_PUBLIC;
// const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL
// const FEE_PERCENTAGE = process.env.REACT_APP_FEE_PERCENTAGE
// const GTRACKID = process.env.REACT_APP_GOOGLE_ANALYTICS_TAG;
// const AUTOPAY_CUTOFF_DATE =  new Date('August 20, 2023 23:59:00').getTime();
// //BACKGROUNDPAGES is a list of pages that have images that take up the entire page
// //This will change the default font color to be white.
// const BACKGROUNDPAGES = ['']

// const TH_GENRES = [
//    'Rock',
//    'Pop',
//    'Metal',
//    'Hip Hop',
//    'Jazz',
//    'Country',
//    'Electronic',
//    'Indie',
//    'Other',
// ];
// const FILE_FIELDS = ["avatar", "images", "type.artist.banner", "banner", "newFlyer", "attachments"];
// //allows for friendly display
// var GENRE_MAP = {}

// const TH_SELECT_GENRE = [
//    { label: 'Rock', value: 'Rock' },
//    { label: 'Pop', value: 'Pop' },
//    { label: 'Metal', value: 'Metal' },
//    { label: 'Hip Hop', value: 'Hip Hop' },
//    { label: 'Jazz', value: 'Jazz' },
//    { label: 'Country', value: 'Country' },
//    { label: 'Electronic', value: 'Electronic' },
//    { label: 'Indie', value: 'Indie' },
//    { label: 'Other', value: 'Other' },
// ];

// const TH_DEFAULT_COLORS = [
//    "#f99d1b", //TuneHatch Orange
//    "#1abc9c", //Turquoise
//    "#3498db", //Blue
//    "#9b59b6", //Purple
//    "#e74c3c", //Bright Red
//    "#f78fb3", //Pink
//    "#f5cd79" //Yellow
// ]

// const TH_DEFAULT_DEALS = {
//    default: {
//       name: "default",
//       type: null,
//       label: "No Payment",
//       description: <span>Artists will not receive payment for this performance, and will not have to pay a production fee.</span>,
//       options: []
//    },
//    guarantee: {
//       name: "guarantee",
//       type: "guarantee",
//       label: "Guarantee",
//       description: <span>Artists will be paid a specific dollar amount for their performance.</span>,
//       options: ["guarantee", "production_fee"],
//       defaults: {
//          guarantee: 10,
//          production_fee: 0
//       }
//    },
//    ticket_split: {
//       name: "ticket_split",
//       type: "ticket_split",
//       label: "Ticket Split",
//       description: <span>Artists will split a specified amount of ticket sales.</span>,
//       options: ["percentage", "guarantee", "production_fee", "even_split"],
//       defaults: {
//          percentage: 0,
//          guarantee: 0,
//          production_fee: 0,
//          even_split: true
//       }
//    }
// }

// //creates genres "safe for data". Removes unwanted characters and replaces whitespace with underscores.
// var TH_SAFE_GENRES = [];
// TH_GENRES.map((genre) => {
//    let safeGenre = genre.toLowerCase().replace(/\s/g, '_')
//    TH_SAFE_GENRES.push(safeGenre);
//    GENRE_MAP[safeGenre] = genre
//    return true;
// });

// export {
//    SERVER_URL,
//    PUBLIC_URL,
//    IMAGE_URL,
//    APIURL,
//    TH_SELECT_GENRE,
//    TH_DEFAULT_COLORS,
//    TH_GENRES,
//    GENRE_MAP,
//    TH_SAFE_GENRES,
//    BACKGROUNDPAGES,
//    STRIPE_PUBLIC,
//    ENVCHECK,
//    FILE_FIELDS,
//    FEE_PERCENTAGE,
//    TH_DEFAULT_DEALS,
//    GTRACKID,
//    MONTH_LABELS,
//    DAY_LABELS,
//    AUTOPAY_CUTOFF_DATE
// };
