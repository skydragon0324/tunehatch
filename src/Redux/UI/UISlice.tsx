import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { View } from "../../Pages/Modals/Views";
import { requestPasswordReset, resetPassword } from "../User/UserSlice";
import { Show } from "../../Helpers/shared/Models/Show";

interface UIState {
  app: {
    loading: boolean;
    pageName: string;
  };
  grid: {
    fullscreen: boolean;
    loading: boolean;
  };
  mostRecentlyOpened: string;
  sidebar: {
    active: boolean;
    width: string;
    component: string | null;
    data: {};
    view: any;
  };
  modal: {
    active: boolean;
    view: any;
    component: string | null;
    data: {};
    navLocked: boolean;
  };
  cover: {
    active: boolean;
    view: any;
    component: string | null;
    data: {};
  };
  drawer: {
    active: boolean;
    view: any;
    component: string | null;
    data: {
      keepOnClose?: boolean;
      shows?: Show[];
      venueID?: string;
      date?: Date;
    };
  };
  statusMessages: {
    key?: number;
    type?: string;
    message?: string;
    timeout_duration?: number;
  }[];
  views: {
    editProfile: View;
    ticketPurchase: View;
    ticketDashboard: View;
    venueToolbox: View;
    showrunnerToolbox: View;
    manageShow: View;
    resetPassword: View;
    createShow: View;
  };
  tooltip: {
    active: boolean;
    data: any;
    width: number;
    backgroundColor: string;
    height: number;
    position: {
      x: number;
      y: number;
    };
  };
}

const initialState: UIState = {
  app: {
    loading: false,
    pageName: "TuneHatch",
  },
  grid: {
    fullscreen: false,
    loading: true,
  },
  sidebar: {
    active: false,
    width: "default",
    view: null,
    component: null,
    data: {},
  },
  modal: {
    active: false,
    view: null,
    component: null,
    data: {},
    navLocked: false,
  },
  mostRecentlyOpened: null,
  cover: {
    active: false,
    view: null,
    component: null,
    data: {},
  },
  drawer: {
    active: false,
    view: null,
    component: null,
    data: {},
  },
  statusMessages: [],
  views: {
    editProfile: {
      category: "",
      view: 0,
    },
    resetPassword: {
      view: 0,
    },
    ticketPurchase: {
      category: "",
      view: 0,
    },
    ticketDashboard: {
      category: "",
      view: 0,
    },
    venueToolbox: {
      category: "",
      view: 0,
    },
    showrunnerToolbox: {
      category: "",
      view: 0,
    },
    manageShow: {
      category: "",
      view: 0,
    },
    createShow: {
      category: "",
      view: 0,
    },
  },
  tooltip: {
    active: false,
    backgroundColor: "rgb(30 41 59)",
    data: null,
    width: 0,
    height: 0,
    position: {
      x: 0,
      y: 0,
    },
  },
};

export type UIStateView = keyof typeof initialState.views;

const startLoad = createAsyncThunk(
  "ui/startLoad",
  async (payload, thunkAPI) => {
    return true;
  }
);

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.app.loading = action.payload;
    },
    setFullscreen: (
      state,
      action: PayloadAction<{ target?: string; status?: boolean }>
    ) => {
      state["grid"].fullscreen = action.payload.status || false;
    },
    openSidebar: (
      state,
      action: PayloadAction<{
        status: boolean;
        view?: any;
        component?: string;
        data?: object;
      }>
    ) => {
      state.sidebar = {
        ...state.sidebar,
        active:
          action.payload.status !== undefined
            ? action.payload.status
            : state.sidebar.active,
        component:
          action.payload.component !== undefined
            ? action.payload.component
            : state.sidebar.component,
        view:
          action.payload.view !== undefined
            ? action.payload.view
            : state.sidebar.view,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.sidebar.data,
      };
      state.mostRecentlyOpened = "sidebar";
    },
    resetSidebar: (state) => {
      state.sidebar = initialState.sidebar;
    },
    openDrawer: (
      state,
      action: PayloadAction<{
        status: boolean;
        view?: any;
        component?: string;
        data?: object;
      }>
    ) => {
      state.drawer = {
        ...state.drawer,
        active:
          action.payload.status !== undefined
            ? action.payload.status
            : state.drawer.active,
        component:
          action.payload.component !== undefined
            ? action.payload.component
            : state.drawer.component,
        view:
          action.payload.view !== undefined
            ? action.payload.view
            : state.drawer.view,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.drawer.data,
      };
    },
    resetDrawer: (state) => {
      state.drawer = initialState.drawer;
    },
    openCover: (
      state,
      action: PayloadAction<{
        status: boolean;
        view?: any;
        component?: string;
        data?: object;
      }>
    ) => {
      state.cover = {
        ...state.cover,
        active:
          action.payload.status !== undefined
            ? action.payload.status
            : state.modal.active,
        component:
          action.payload.component !== undefined
            ? action.payload.component
            : state.modal.component,
        view:
          action.payload.view !== undefined
            ? action.payload.view
            : state.modal.view,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.modal.data,
      };
    },
    openModal: (
      state,
      action: PayloadAction<{
        status: boolean;
        view?: any;
        component?: string;
        data?: object;
      }>
    ) => {
      state.modal = {
        ...state.modal,
        active:
          action.payload.status !== undefined
            ? action.payload.status
            : state.modal.active,
        component:
          action.payload.component !== undefined
            ? action.payload.component
            : state.modal.component,
        view:
          action.payload.view !== undefined
            ? action.payload.view
            : state.modal.view,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.modal.data,
      };
      state.mostRecentlyOpened = "modal";
    },
    resetModal: (state) => {
      state.modal = initialState.modal;
    },
    openTooltip: (
      state,
      action: PayloadAction<{
        status?: boolean;
        data?: any;
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        backgroundColor?: string;
        screenWidth?: number;
      }>
    ) => {
      state.tooltip = {
        ...state.tooltip,
        active:
          action.payload.status !== undefined
            ? action.payload.status
            : state.tooltip.active,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.tooltip.data,
        backgroundColor:
          action.payload.backgroundColor !== undefined
            ? action.payload.backgroundColor
            : state.tooltip.backgroundColor,
        position: {
          ...state.tooltip.position,
          x:
            action.payload.x !== undefined
              ? action.payload.x
              : state.tooltip.position.x,
          y:
            action.payload.x !== undefined
              ? action.payload.y
              : state.tooltip.position.y,
        },
        width:
          action.payload.width !== undefined
            ? action.payload.width
            : state.tooltip.width,
        height:
          action.payload.width !== undefined
            ? action.payload.height
            : state.tooltip.height,
      };
    },
    resetTooltip: (state) => {
      state.tooltip = initialState.tooltip;
    },
    //Timeout duration is optional. Use in cases where confirmation text may be long.
    addStatusMessage: (
      state,
      action: PayloadAction<{
        type: string;
        message: string;
        timeout_duration?: number;
      }>
    ) => {
      state.statusMessages.push({
        type: action.payload.type,
        message:
          action.payload.message ||
          (action.payload.type === "error" &&
            "Something went wrong! If this continues, please contact us at info@tunehatch.com"),
        timeout_duration: action.payload.timeout_duration || 3000,
      });
    },
    removeStatusMessage: (state, action: PayloadAction<number>) => {
      state.statusMessages[action.payload] = {};
    },
    updateView: (
      state,
      action: PayloadAction<{
        target: keyof typeof state.views;
        category?: string;
        view?: any;
        data?: {};
      }>
    ) => {
      state.views[action.payload.target] = {
        ...state.views[action.payload.target],
        category:
          action.payload.category !== undefined
            ? action.payload.category
            : state.views[action.payload.target].category,
        view:
          action.payload.view !== undefined
            ? action.payload.view
            : state.views[action.payload.target].view,
        data:
          action.payload.data !== undefined
            ? action.payload.data
            : state.views[action.payload.target].data,
      };
    },
    resetView: (state, action: PayloadAction<keyof typeof state.views>) => {
      state.views[action.payload] = initialState.views[action.payload];
    },
    resetUI: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.views.resetPassword.view = 1;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state, action) => {
      state.views.resetPassword.view = 1;
    });
  },
});

//export actions
export { startLoad };
export const {
  setAppLoading,
  setFullscreen,
  openSidebar,
  resetSidebar,
  openTooltip,
  resetTooltip,
  openDrawer,
  resetDrawer,
  openCover,
  addStatusMessage,
  removeStatusMessage,
  openModal,
  resetModal,
  updateView,
  resetView,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
