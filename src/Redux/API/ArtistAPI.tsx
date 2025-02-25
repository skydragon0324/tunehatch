import { Show } from "../../Helpers/shared/Models/Show";
import { baseAPI } from "./BaseAPI";
import { publicAPI } from "./PublicAPI";

export const artistAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    artistApply: builder.mutation<any, any & Pick<Show, "showID">>({
      query: (args: {
        SECRET_UID: string;
        id: string;
        showID: string;
        venueID: string;
        phone?: string;
      }) => ({
        method: "POST",
        url: "/artist/apply",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const result = dispatch(
          publicAPI.util.updateQueryData(
            "getAllShows",
            undefined,
            (draft: any) => {
              return {
                ...draft,
                [args.showID]: {
                  ...draft[args.showID],
                  applications: [
                    {
                      uid: args.id,
                      type: "application",
                    },
                  ],
                },
              };
            },
          ),
        );

        try {
          const result = await queryFulfilled;
        } catch (err) {
          result.undo();
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
    artistCalculatePayouts: builder.query<any, any & Pick<Show, "showID">>({
      query: (args: { SECRET_UID: string; showID: string }) => ({
        method: "POST",
        url: "/artist/calculate-payouts",
        body: args,
      }),
    }),
    respondToArtistPerformance: builder.mutation<
      Show,
      {
        SECRET_UID: string;
        showID: string;
        artistID: string;
        venueID: string;
        status: "accepted" | "rejected";
      } & Pick<Show, "_key">
    >({
      query: (args) => ({
        method: "POST",
        url: "/artist/respond-to-performance",
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
          }),
        );

        try {
          await queryFulfilled; // Wait for the query to complete
        } catch {
          result.undo();
          // Handle the error if the query fails
        }
      },
      invalidatesTags: (result, error, { showID }) => [
        { type: "Show", id: result.showID },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useArtistApplyMutation,
  useArtistCalculatePayoutsQuery,
  useRespondToArtistPerformanceMutation,
} = artistAPI;
