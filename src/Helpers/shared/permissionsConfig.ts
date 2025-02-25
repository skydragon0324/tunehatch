//Individual permissions

const PERMISSION_MAP: {
  [key: string]: {
    label: string;
    description: string;
    default_roles?: any[];
    meta?: boolean;
  };
} = {
  IS_OWNER: {
    label: "Venue Owner",
    description: "Created the venue. Has all access.",
    default_roles: [],
    meta: true,
  },
  IS_ADMIN: {
    label: "Venue Admin",
    description:
      "Has all administration rights; this bypasses any other permissions, and gives the user as much power as the venue owner. Be careful assigning this role.",
    default_roles: [],
  },
  CAN_MESSAGE: {
    label: "Message & Notifications",
    description:
      "Can send messages as the venue, and see and clear any venue notifications.",
  },
  CAN_EDIT_VENUE: {
    label: "Edit Venue",
    description: "Can edit venue details",
    default_roles: [],
  },
  CAN_SEE_DEALS: {
    label: "See Deals",
    description: "Can see deals with artists",
  },
  CAN_EDIT_DEALS: {
    label: "Edit Deals",
    description: "Can adjust deals with artists",
  },
  CAN_MANAGE_PAYOUTS: {
    label: "Manage Payouts",
    description: "Can update payout information",
    default_roles: [],
  },
  CAN_MANAGE_PERFORMANCE_AGREEMENT: {
    label: "Manage Performance Agreement",
    description: "Can change and update Performance Agreement",
    default_roles: [],
  },
  CAN_CREATE_SHOW: {
    label: "Create Show",
    description: "Can create new shows for the venue",
    default_roles: [],
  },
  CAN_EDIT_SHOW: {
    label: "Edit Show",
    description: "Can edit or delete any shows the venue is hosting",
    default_roles: [],
  },
  CAN_PUBLISH_SHOW: {
    label: "Publish Show",
    description: "Can publish shows to the TuneHatch Shows page.",
    default_roles: [],
  },
  CAN_BOOK_SHOW: {
    label: "Book Show",
    description:
      "Can accept, reject, cancel, and invite artists to venue shows",
    default_roles: [],
  },
  CAN_MANAGE_GUESTLIST: {
    label: "Manage Guestlist",
    description: "Can see and manage the guest list for venue shows",
    default_roles: [],
  },
  CAN_SEE_NUMBER_SOLD: {
    label: "See Number of Tickets Sold",
    description: "Can see the number of tickets sold for a venue show",
    default_roles: [],
  },
  CAN_SEE_SHOW_PAYOUT: {
    label: "See Show Payouts",
    description: "Can see the payout amount on the Manage Show Page",
    default_roles: [],
  },
  CAN_UPDATE_FLYER: {
    label: "Update Flyer",
    description: "Can update flyers for venue shows",
    default_roles: [],
  },
  CAN_UPDATE_NOTES: {
    label: "Edit Show Notes",
    description: "Can see and edit notes for shows",
    default_roles: [],
  },
};

const PERMISSION_TYPES = Object.keys(PERMISSION_MAP);

//Default Roles
var DEFAULT_PERMISSIONS: { [key: string]: boolean } = {};
var ALL_PERMISSIONS: { [key: string]: boolean } = {};

PERMISSION_TYPES.forEach((permission) => {
  DEFAULT_PERMISSIONS[permission] = false;
  ALL_PERMISSIONS[permission] = true;
});

const OWNER_DEFAULT_PERMISSIONS = {
  ...ALL_PERMISSIONS,
};

const PROMOTER_DEFAULT_PERMISSIONS = {
  ...DEFAULT_PERMISSIONS,
  CAN_EDIT_SHOW: true,
  CAN_CREATE_SHOW: true,
  CAN_PUBLISH_SHOW: true,
  CAN_BOOK_SHOW: true,
  CAN_MANAGE_GUESTLIST: true,
  CAN_SEE_NUMBER_SOLD: true,
  CAN_SEE_SHOW_PAYOUT: true,
  CAN_UPDATE_FLYER: true,
};

const COHOST_PERMISSION_CHUNK = {
  CAN_PUBLISH_SHOW: true,
  CAN_UPDATE_FLYER: true,
  CAN_BOOK_SHOW: true,
};

//Role Assignment Functions
export {
  PERMISSION_MAP,
  OWNER_DEFAULT_PERMISSIONS,
  PROMOTER_DEFAULT_PERMISSIONS,
  COHOST_PERMISSION_CHUNK,
};
