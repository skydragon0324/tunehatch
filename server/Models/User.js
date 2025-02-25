export const returnStatement = `RETURN MERGE(user, {
    invites: (
        FOR show IN shows
        FOR invite IN show.invites
        FILTER user._key == invite.uid || user._key == invite.id
        RETURN {sid: show._key, pay: invite.pay, timeslot: invite.timeslot, status: invite.status}
    )
}, {permissions: MERGE(
  FOR perm IN permissions
  FILTER perm[user._key] != null
  RETURN {[perm.venueID] : perm[user._key]}
)},
{sr_groups: MERGE(
   FOR membership IN sr_memberships
   FILTER membership._from == CONCAT("users/", user._key)
   RETURN {[membership.SRID] : {type: membership.type}}
)}
)`;

export const verifyQuery = `
FOR user IN users
FILTER user._key == @uid
${returnStatement}`

export const loginQuery = `
for user IN users
FILTER LOWER(user.username) == LOWER(@username) || LOWER(user.email) == LOWER(@email) || user.phone == @phone
${returnStatement}`

//default, blank canvas user object
var userObject = {
   firstname: "",
   lastname: "",
   email: "",
   password: "",
   avatar: '',
   type: {
      fan: {
         enabled: true,
         bio: '',
      },
      artist: {
         enabled: false,
         video: '',
         images: [],
         stagename: false,
         bands: [],
         draw: 0,
         socials: {
            facebook: '',
            twitter: '',
            instagram: '',
            website: '',
            tiktok: '',
         },
         shows: [],
         genre: [],
      },
      host: {
         enabled: false,
         venues: [],
         verified: false,
         socials: {
            facebook: '',
            twitter: '',
            instagram: '',
            website: '',
            tiktok: '',
         },
      },
      showrunner: {
         enabled: false
      }
   },
   created: Date.now(),
   claimed: Date.now()
}

/**
 * createNewUserObject
 * Creates a new user object ready to be inserted to the database.
 * @param {str} firstname 
 * @param {str} lastname 
 * @param {str} email 
 * @param {Argon2} hashedPassword 
 */
export function createNewUserObject(form) {
   const user = {
      ...userObject,
      ...form
   }
   return user
}

/**
 * createUnmannedUserObject
 * Creates a new user object that has not yet been claimed.
 * @param {Object} userData
 * @param {Object} fanData
 * @param {Object} artistData
 * @param {Object} hostData 
 * @param {Object} showrunnerData
 */
export function createUnmannedUserObject(userData, fanData, artistData, hostData, showrunnerData) {
   if (!artistData?.stagename || artistData.stagename === '') {
      artistData.stagename = false;
   }
   const user = {
      ...userObject,
      ...userData,
      type: {
         fan: {
            ...userObject.type.fan,
            ...fanData
         },
         artist: {
            ...userObject.type.artist,
            ...artistData
         },
         host: {
            ...userObject.type.host,
            ...hostData
         },
         showrunner: {
            ...userObject.type.showrunner,
            ...showrunnerData
         }
      },
      claimCode: Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join(''),
      claimed: false
   }
   return user
}