import { Conversation } from "../../Helpers/shared/Models/Conversations";
import { Show } from "../../Helpers/shared/Models/Show";
import { addStatusMessage, resetSidebar } from "../UI/UISlice";
import { baseAPI } from "./BaseAPI";
import { publicAPI } from "./PublicAPI";

export const industryAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    toggleLineupLock: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        showID: string;
        venueID: string;
        status: boolean;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/toggle-lineup-lock",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const result = dispatch(
          publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
            return {
              ...draft,
              [args.showID]: {
                ...draft[args.showID],
                lineup_locked: args.status,
              },
            };
          })
        );

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result._key },
      ],
    }),
    respondToPerformance: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        artistID: string;
        artistName: string;
        contactNumber: string;
        showID: string;
        showDate: any;
        venuePhone: string;
        status: "accepted" | "rejected";
        hasTextContactEnabled: boolean;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/respond-to-performance",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const result = dispatch(
          publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
            return {
              ...draft,
              [args.showID]: {
                ...draft[args.showID],
                lineup_locked: args.status,
              },
            } as any;
          })
        );

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    textResponseToPerformance: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        artistID: string;
        artistName: string;
        contactNumber: string;
        showID: string;
        showDate: any;
        venuePhone: string;
        status: "accepted" | "rejected";
        hasTextContactEnabled: boolean;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/incoming-sms",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const result = dispatch(
          publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
            return {
              ...draft,
              [args.showID]: {
                ...draft[args.showID],
                lineup_locked: args.status,
              },
            } as any;
          })
        );

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    updateShowDescription: builder.mutation<
      Show,
      { showID: string; description: string; venueID: string } & Pick<
        Show,
        "_key"
      >
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/update-show-description",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const result = dispatch(
          publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
            return {
              ...draft,
              [args.showID]: {
                ...draft[args.showID],
                description: args.description,
              },
            };
          })
        );

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    cancelBooking: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        showID: string;
        artistID: string;
        venueID: string;
        artistName: string;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/cancel-booking",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {}
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result._key },
      ],
    }),
    updateShowFlyer: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        showID: string;
        venueID: string;
        flyer: any;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/update-show-flyer",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {}
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    publishShow: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        showID: string;
        venueID: string;
        flyer: any;
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/ind/publish-show",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {}
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result._key },
      ],
    }),
    inviteArtists: builder.mutation<Show, any & Pick<Show, "_key">>({
      query: (args) => ({
        method: "POST",
        url: "/ind/invite-artists",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        console.log(args);
        // const result = dispatch(publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
        //   return {
        //     ...draft,
        //     [args.showID] : {
        //       ...draft[args.showID],
        //       lineup_locked: args.status
        //     }
        //   }
        // }));

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          // result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    getMessages: builder.query<any, any>({
      query: (args: { SECRET_UID: string }) => ({
        method: "POST",
        url: "ind/get-messages",
        body: args,
      }),
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "Message",
            id: res,
          };
        }),
    }),
    sendMessage: builder.mutation<any, any>({
      query: (args: {
        SECRET_UID: string;
        participants: Array<any>;
        responseID: string;
        value: string;
      }) => ({
        method: "POST",
        url: "ind/send-message",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        console.log(args);
        const result = dispatch(
          industryAPI.util.updateQueryData(
            "getMessages",
            { SECRET_UID: args.SECRET_UID },
            (draft) => {
              let index = draft.findIndex(
                (convo: Conversation) =>
                  String(convo.participants) === String(args.participants)
              );
              if (index === -1) {
                draft.unshift({
                  content: args.value,
                  sender: args.responseID?.id,
                  timestamp: Date.now(),
                });
              } else {
                draft[index].messages.push({
                  content: args.value,
                  sender: args.responseID?.id,
                  timestamp: Date.now(),
                });
              }
              return draft;
            }
          )
        );
        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result) =>
        Object.keys(result).map((res) => {
          return {
            type: "Message",
            id: res,
          };
        }),
    }),
    addConfirmedArtists: builder.mutation<Show, any & Pick<Show, "_key">>({
      query: (args: {
        SECRET_UID: string;
        venueID: string;
        showID: string;
        performers: string;
      }) => ({
        method: "POST",
        url: "/ind/add-confirmed-artists",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        console.log(args);
        // const result = dispatch(publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
        //   return {
        //     ...draft,
        //     [args.showID] : {
        //       ...draft[args.showID],
        //       lineup_locked: args.status
        //     }
        //   }
        // }));

        try {
          await queryFulfilled; // Wait for the query to complete
          dispatch(resetSidebar());
        } catch {
          // result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result._key },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useToggleLineupLockMutation,
  useAddConfirmedArtistsMutation,
  useRespondToPerformanceMutation,
  useInviteArtistsMutation,
  useCancelBookingMutation,
  useUpdateShowFlyerMutation,
  useUpdateShowDescriptionMutation,
  usePublishShowMutation,
  useTextResponseToPerformanceMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = industryAPI;
