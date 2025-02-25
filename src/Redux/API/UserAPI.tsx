import { baseAPI } from "./BaseAPI";
import { publicAPI } from "./PublicAPI";
export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    editProfile: builder.mutation<any, any>({
      query: (form) => ({
        method: "POST",
        url: "/user/edit-profile",
        body: form,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        console.log(args?.get("type.artist.stagename"));

        try {
          const result = await queryFulfilled;
        } catch (err) {
          // result.undo();
        }
      },
      invalidatesTags: (result, error, { _key }) => [
        { type: "Artist", id: result.user._key },
      ],
    }),
    getUserTickets: builder.query<any, any>({
      query: (args: { SECRET_UID: string }) => ({
        method: "POST",
        url: "user/get-user-tickets",
        body: { SECRET_UID: args.SECRET_UID },
      }),
    }),
    getNotifications: builder.query<any, any>({
      query: (args: { SECRET_UID: string; venueList: any }) => ({
        method: "POST",
        url: "user/get-notifications",
        body: { SECRET_UID: args.SECRET_UID, venueList: args.venueList },
      }),
    }),
    clearNotifications: builder.mutation<any, any>({
      query: (args: { SECRET_UID: string; venueList: any }) => ({
        method: "POST",
        url: "user/clear-notifs",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Notification" }],
    }),
    allNotificationsRead: builder.mutation<any, any>({
      query: (args: { SECRET_UID: string; venueList: any }) => ({
        method: "POST",
        url: "user/notifs-all-read",
        body: { SECRET_UID: args.SECRET_UID, venueList: args.venueList },
      }),
      invalidatesTags: (result, error) => [{ type: "Notification" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useEditProfileMutation,
  useGetUserTicketsQuery,
  useGetNotificationsQuery,
  useClearNotificationsMutation,
  useAllNotificationsReadMutation,
} = userAPI;
