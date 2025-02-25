import { Show } from "../../Helpers/shared/Models/Show";
import { UserObject } from "../../Helpers/shared/Models/User";
import { baseAPI } from "./BaseAPI";
import { setAppLoading } from "../UI/UISlice";
import { Showrunner } from "../../Helpers/shared/Models/Showrunner";
import { Venue } from "../../Helpers/shared/Models/Venue";
import { ArtistObject } from "../../Helpers/shared/Models/Artist";

export const publicAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllShows: builder.query<{ [id: string]: Show }, void>({
      query: () => "/get-all-shows",
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "Show",
            id: res,
          };
        }),
    }),
    getAllShowrunnerGroups: builder.query<{ [id: string]: Showrunner }, void>({
      query: () => "/get-sr-groups",
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "SRG",
            id: res,
          };
        }),
    }),
    getAllArtists: builder.query<{ [id: string]: ArtistObject }, void>({
      // The URL for the request is '/api/get-all-artists'
      query: () => "/get-all-artists",
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "Artist",
            id: res,
          };
        }),
    }),
    setPaymentIntent: builder.mutation<any, any>({
      query: (args: {
        showID: string;
        cart: object;
        name?: string;
        email?: string;
        intentID: string;
      }) => ({
        method: "POST",
        url: "/set-payment-intent",
        body: args,
      }),
    }),
    getAllVenues: builder.query<{ [id: string]: Venue }, void>({
      // The URL for the request is '/api/get-all-artists'
      query: () => "/get-all-venues",
      providesTags: (result) =>
        Object.keys(result).map((res) => {
          return {
            type: "Venue",
            id: res,
          };
        }),
    }),
    getUsers: builder.query<{ [id: string]: UserObject }, string[]>({
      query: (ids) => ({
        method: "POST",
        url: "/get-users",
        body: { ids },
      }),
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "Artist",
            id: res,
          };
        }),
    }),
    logIn: builder.mutation<any, any>({
      query: (form) => ({
        url: "/log-in",
        method: "POST",
        body: form,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (args) => ({
        url: "/register",
        method: "POST",
        body: args,
      }),
    }),
    logOut: builder.mutation<any, any>({
      query: () => ({
        url: "/log-out",
      }),
    }),
    cookieLogIn: builder.mutation<any, any>({
      query: (SECRET_UID) => ({
        method: "POST",
        url: "/verify-user",
        body: { SECRET_UID },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        dispatch(setAppLoading(true));

        try {
          await queryFulfilled; // Wait for the query to complete
          dispatch(setAppLoading(false));
        } catch {
          dispatch(setAppLoading(false));
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
    }),
    generateTickets: builder.mutation<any, any>({
      query: (args: {
        SECRET_UID: string;
        showID: string;
        venueID: string;
        intentID: string;
        email?: string;
        name?: string;
        cart: object;
        method: string;
      }) => ({
        url: "/generate-tickets",
        method: "POST",
        body: args,
      }),
    }),
    claimProfile: builder.mutation<any, any>({
      query: (args) => ({
        url: "/claim-profile",
        method: "POST",
        body: args,
      }),
    }),
    fetchClaimedProfile: builder.query<any, any>({
      query: (args: { claimCode: string }) => ({
        url: "/fetch-claim-profile",
        method: "POST",
        body: args,
      }),
    }),
    setWAYGTS: builder.mutation<any, any>({
      query: (args) => ({
        url: "/waygts",
        method: "POST",
        body: args,
      }),
    }),
    getSpotlight: builder.query<any, void>({
      query: () => ({
        url: "/get-spotlight-info",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllArtistsQuery,
  useGetSpotlightQuery,
  useLogInMutation,
  useGenerateTicketsMutation,
  useGetUsersQuery,
  useGetAllShowsQuery,
  useCookieLogInMutation,
  useGetAllVenuesQuery,
  useGetAllShowrunnerGroupsQuery,
  useRegisterMutation,
  useFetchClaimedProfileQuery,
  useClaimProfileMutation,
  useSetWAYGTSMutation,
  useSetPaymentIntentMutation,
} = publicAPI;

export const useGetShowsQueryState =
  publicAPI.endpoints.getAllShows.useQueryState;
