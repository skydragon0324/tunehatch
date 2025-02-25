import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { publicAPI } from "../API/PublicAPI";
import { APIURL } from "../../Helpers/configConstants";
import { UserObject } from "../../Helpers/shared/Models/User";
import { setCookie, clearCookie } from "../../Helpers/HelperFunctions";
import { venueAPI } from "../API/VenueAPI";
import { showrunnerAPI } from "../API/ShowrunnerAPI";
import { userAPI } from "../API/UserAPI";
import { ParsedNotifications } from "../../Helpers/shared/Models/Notifications";
import { Type } from "../../Helpers/shared/Models/Type";

interface UserState extends UserObject {
  created: any;
  email: string | null;
  bio: string;
  responseID: {
    id: string,
    type: Type,
  } | null
  type: {
    artist: {
      enabled: boolean;
      hometown: string;
      stagename: string;
      genre: string;
      subgenre: string;
      socials: any;
      banner: string;
    };
    host: {
      enabled: boolean;
      venues: string[];
    };
  };
}

interface CartState {}

export type FormKeys =
  | "createShow"
  | "resetPassword"
  | "createSRG"
  | "editProfile"
  | "inviteArtists";

export type CreateShowForm = {
  applications: any[];
  performers: any;
  invites: any[];
  showrunner: any[];
};

export type ShowFormType = "application" | "invite" | "performer";
export type ShowIntent = "accept" | "reject" | "info" | "cancel";

export type ResetPasswordForm = {
  email: string | null;
  password: string | null;
};

export type CreateSRGForm = {
  roster: any[];
};

export type InviteArtists = {
  invites: any[];
};

export type Forms = {
  [key in FormKeys]: any;
} & { [key: string]: any };

const initialState: {
  location:{
    local: string,
    current: string
    regionCode: string,
    currentRegion: string,
    currentRegionFeatured: boolean,
    currentRegionLocations: Array<string>
  }
  notifications: {
    read?: ParsedNotifications[];
    unread?: ParsedNotifications[];
  };
  forms: Forms;
  data: any;
  cart: any;
  tickets: any;
} = {
  location:{
    local: "Nashville, TN",
    regionCode: "nashville",
    current: "Nashville, TN",
    currentRegion: null,
    currentRegionFeatured: false,
    currentRegionLocations: []
  },
  notifications: {},
  data: {
    created: null,
    uid: "",
    bio: null,
    responseID: null,
    displayUID: null,
    type: {
      artist: {
        enabled: false,
        hometown: "",
        stagename: "",
        genre: "",
        subgenre: "",
        banner: "",
        socials: {
          spotifyLink: "",
          instagram: "",
          tiktokLink: "",
          youtubeLink: "",
        },
      },
      host: {
        enabled: false,
        banner: "",
        venues: [],
      },
      showrunner: {
        enabled: false,
      },
    },
    firstname: null,
    lastname: null,
    avatar: null,
    email: null,
    artist: false,
    host: false,
    showrunner: false,
    venues: [],
    primaryCity: "",
    secondaryCity: "",
    shows: [],
    sr_groups: [],
  },
  forms: {
    createShow: {
      applications: [],
      performers: [],
      invites: [],
      showrunner: [],
    },
    resetPassword: {
      email: null,
      password: null,
    },
    createSRG: {
      roster: [],
    },
    editProfile: {},
    inviteArtists: {
      invites: [],
    },
  },
  cart: {},
  tickets: {
    saved: [],
    generated: [],
  },
};

const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload: { password: string; token: string }, thunkAPI) => {
    try {
      let result = await axios.post(APIURL + "reset-password", {
        password: payload.password,
        token: payload.token,
      });
      setCookie("SECRET_UID", result.data.uid, 365);
      return result.data;
    } catch (err) {
      console.log((err as any).response.data);
      return thunkAPI.rejectWithValue((err as any).response.data);
    }
  }
);

const requestPasswordReset = createAsyncThunk(
  "user/requestPasswordReset",
  async (payload: { email: string }, thunkAPI) => {
    try {
      let result = await axios.post(APIURL + "send-password-reset", {
        email: payload.email,
      });
      return result;
    } catch (err) {
      console.log((err as any).response.data);
      return thunkAPI.rejectWithValue((err as any).response.data);
    }
  }
);

type FormPayloadAction = PayloadAction<{
  form: string;
  field: string;
  index?: string | number;
  key?: string;
  value?: { [key: string]: any } | string;
}>;

const getIndex = (action: FormPayloadAction, state: any) => {
  return Number.isInteger(Number(action.payload.index))
    ? action.payload.index
    : state.forms[action.payload.form][action.payload.field].findIndex(
        (element: any) => {
          if (typeof action.payload.value === "string") {
            return element[action.payload.key] === action.payload.value;
          }

          return (
            element[action.payload.key] ===
            action.payload.value[action.payload.key]
          );
        }
      );
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    formInitialize: (state, action: PayloadAction<{ form: object }>) => {},
    formUpdate: (
      state,
      action: PayloadAction<{
        form: string;
        field: string;
        value: string | number | any;
      }>
    ) => {
      if (!state.forms?.[action.payload.form]) {
        state.forms[action.payload.form] = {
          [action.payload.field]: action.payload.value,
        };
      } else {
        state.forms[action.payload.form][action.payload.field] =
          action.payload.value;
      }
    },
    userUpdate: (state, action: PayloadAction<{}>) => {},
    clearForm: (state, action: PayloadAction<{ form: string }>) => {
      state.forms[action.payload.form] =
        initialState.forms[action.payload.form] || {};
    },
    formAppend: (
      state,
      action: PayloadAction<{
        form: string;
        field: string;
        value: string | number | { [key: string]: any };
      }>
    ) => {
      if (!state.forms?.[action.payload.form]) {
        state.forms[action.payload.form] = {
          [action.payload.field]: [action.payload.value],
        };
      } else {
        state.forms[action.payload.form][action.payload.field] = [
          ...state.forms[action.payload.form][action.payload.field],
          action.payload.value,
        ];
      }
    },
    formArrayUpdate: (state, action: FormPayloadAction) => {
      let index = getIndex(action, state);
      if (typeof action.payload.value === "string") {
        state.forms[action.payload.form][action.payload.field][index] =
          action.payload.value;
      } else {
        state.forms[action.payload.form][action.payload.field][index] = {
          ...state.forms[action.payload.form][action.payload.field][index],
          ...(action.payload.value || ""),
        };
      }
    },
    removeFormArray: (state, action: FormPayloadAction) => {
      let index = getIndex(action, state);
      delete state.forms[action.payload.form][action.payload.field][index];
    },
    formSplice: (state, action: FormPayloadAction) => {
      let index = getIndex(action, state);
      state.forms[action.payload.form][action.payload.field].splice(index, 1);
    },
    updateCurrentLocation: (state, action: PayloadAction<string>) => {
      state.location.current = action.payload
    },
    removeFormField: (
      state,
      action: PayloadAction<{ form: string; field: string }>
    ) => {
      delete state.forms[action.payload.form]?.[action.payload.field];
    },
    setCurrentRegion: (state, action: PayloadAction<{region: string, locations?: Array<string>, featured?: boolean}>) => {
      state.location.currentRegion = action.payload.region;
      state.location.currentRegionLocations = action.payload.locations || state.location.currentRegionLocations;
      state.location.currentRegionFeatured = action.payload.featured || false
    },
    resetCurrentRegion: (state) => {
      state.location = initialState.location
    },
    // setCreateShowDate: (state, action) => {
    //   state.forms.createShow.starttime = action.payload.date;
    //   state.forms.createShow.endtime = action.payload.date;
    // },
    logOut: (state) => {
      clearCookie("SECRET_UID");
      return initialState;
    },
    updateResponseID: (state, action: PayloadAction<{id: string, type: Type}>) => {
      state.data.responseID = action.payload
    },
    updateCart: (
      state,
      action: PayloadAction<{
        showID: string;
        tierNumber: string;
        price: number;
        customFee?: number;
        customTax?: number;
        venueFee: number;
        quantity: number;
      }>
    ) => {
      state.cart[action.payload.showID] = {
        ...state.cart?.[action.payload.showID],
        [action.payload.tierNumber]: {
          ...state.cart?.[action.payload.showID]?.[action.payload.tierNumber],
          price: action.payload.price,
          venueFee: action.payload.venueFee,
          customFee: action.payload.customFee,
          customTax: action.payload.customTax,
          quantity:
            action.payload.quantity < 0 ? 0 : action.payload.quantity || 0,
        },
      };
    },
    clearCart: (state) => {
      state.cart = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.data = {
        ...action.payload,
      };
    });
    builder.addMatcher(
      userAPI.endpoints.editProfile.matchPending,
      (state, action) => {
        //this updates the (very few) user state touchpoints that should be updated in realtime.
        //everything else will be updated within a second or two

        state.data.type.artist.stagename = JSON.parse(
          action.meta.arg.originalArgs.get("type.artist.stagename")
        );
      }
    );
    builder.addMatcher(
      userAPI.endpoints.editProfile.matchFulfilled,
      (state, { payload }) => {
        console.log(payload);
        state.data = {
          ...state.data,
          ...payload.user,
        };
      }
    );
    builder.addMatcher(
      userAPI.endpoints.getNotifications.matchFulfilled,
      (state, { payload }) => {
        state.notifications = {
          ...state.notifications,
          ...payload,
        };
      }
    );
    builder.addMatcher(
      userAPI.endpoints.allNotificationsRead.matchFulfilled,
      (state, { payload }) => {
        state.notifications = { read: payload.read, unread: payload.unread };
      }
    );
    builder.addMatcher(
      userAPI.endpoints.clearNotifications.matchFulfilled,
      (state) => {
        state.notifications = initialState.notifications;
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.cookieLogIn.matchFulfilled,
      (state, { payload }) => {
        setCookie("SECRET_UID", payload.uid);
        state.data = {
          ...payload,
          artist: payload.type.artist.enabled,
          host: payload.type.host.enabled,
          showrunner: payload.type.showrunner.enabled,
          venues: payload.type.host.venues,
        };
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        setCookie("SECRET_UID", payload.uid);
        state.data = {
          ...payload,
          artist: payload.type.artist.enabled,
          host: payload.type.host.enabled,
          showrunner: payload.type.showrunner.enabled,
          venues: payload.type.host.venues,
        };
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.claimProfile.matchFulfilled,
      (state, { payload }) => {
        setCookie("SECRET_UID", payload.uid);
        state.data = {
          ...payload,
          artist: payload.type.artist.enabled,
          host: payload.type.host.enabled,
          showrunner: payload.type.showrunner.enabled,
          venues: payload.type.host.venues,
        };
      }
    );
    builder.addMatcher(
      venueAPI.endpoints.createVenue.matchFulfilled,
      (state, { payload }) => {
        state.data.venues = [...state.data.venues, payload._key];
      }
    );
    builder.addMatcher(
      showrunnerAPI.endpoints.createSRG.matchFulfilled,
      (state, { payload }) => {
        state.data.sr_groups[payload._key] = { type: "admin" };
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.logIn.matchFulfilled,
      (state, { payload }) => {
        setCookie("SECRET_UID", payload.uid);
        state.data = {
          ...payload,
          artist: payload.type.artist.enabled,
          host: payload.type.host.enabled,
          showrunner: payload.type.showrunner.enabled,
          venues: payload.type.host.venues,
        };
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.generateTickets.matchPending,
      (state) => {
        state.tickets.generated = [];
      }
    );
    builder.addMatcher(
      publicAPI.endpoints.generateTickets.matchFulfilled,
      (state, { payload }) => {
        state.tickets.generated = payload;
      }
    );
  },
});

//export actions
export { requestPasswordReset, resetPassword };
export const {
  formUpdate,
  formAppend,
  formSplice,
  updateCurrentLocation,
  formArrayUpdate,
  removeFormArray,
  removeFormField,
  clearForm,
  logOut,
  setCurrentRegion,
  resetCurrentRegion,
  updateCart,
  clearCart,
  updateResponseID
} = userSlice.actions;

export default userSlice.reducer;
