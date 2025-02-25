import { Show } from "../../Helpers/shared/Models/Show";
import { Ticket } from "../../Helpers/shared/Models/Ticket";
import { updateView } from "../UI/UISlice";
import { baseAPI } from "./BaseAPI";
import { publicAPI } from "./PublicAPI";

export const venueAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getShowNotes: builder.query<
      any,
      { SECRET_UID: string; showID: string; venueID: string }
    >({
      query: (args) => ({
        method: "POST",
        url: "/venue/get-show-notes",
        body: args,
      }),
      providesTags: (result) => [{ type: "Show", id: result.showID }],
    }),
    getSoldTickets: builder.query<Ticket, Object>({
      query: (ids) => ({
        url: "/venue/get-sold-tickets",
        method: "POST",
        body: ids,
      }),
      providesTags: (result) =>
        Object.keys(result!).map((res) => {
          return {
            type: "Ticket",
            id: res,
          };
        }),
    }),
    calculatePayouts: builder.query<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/calculate-payouts",
        body: args,
      }),
      providesTags: (result, error) => [{ type: "Show", id: result._key }],
    }),
    redeemTicket: builder.mutation<any, any & Pick<Ticket, "ticketID">>({
      query: (args: {
        showID: any;
        venueID: any;
        ticketID: string;
        redeemed: boolean;
        uid: string;
      }) => ({
        url: "/venue/redeem-ticket",
        method: "POST",
        body: {
          SECRET_UID: args.uid,
          showID: args.showID,
          venueID: args.venueID,
          ticketID: args.ticketID,
          redeemed: args.redeemed,
        },
      }),
      invalidatesTags: (result, error) => [{ type: "Ticket" }],
    }),
    editShowNotes: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/edit-show-notes",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Venue" }],
    }),
    editShow: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/edit-show",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Show", id: result._key }],
    }),
    createVenue: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/create-new-venue",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Venue" }],
    }),
    editVenue: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/edit-venue",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Venue", id: result._key }],
    }),
    updatePerformanceAgreement: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/update-performance-agreement",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Venue", id: result._key }],
    }),
    createShow: builder.mutation<Show, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/create-show",
        body: args,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        dispatch(updateView({target: "createShow", view: 1}))
        const result = dispatch(
          publicAPI.util.updateQueryData("getAllShows", undefined, (draft) => {
            return {
              ...draft,
              ["pending"]: {
                ...args.form,
                calTag: "grey"
              },
            };
          }),
        );

        try {
          const show = await queryFulfilled; // Wait for the query to complete
          dispatch(updateView({target: "createShow", view: 2, data: {showID: show.data._key}}))
        } catch {
          result.undo();
          // Handle the error if the query fails
          // For example: dispatch(someErrorAction());
        }
      },
      invalidatesTags: (result, error) => [{ type: "Show" }],
    }),
    deleteShow: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/venue/delete-show",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "Show" }],
    }),
    getShowPayoutStatus: builder.query<
      any,
      { SECRET_UID: string; showIDs: any[]; venueID: string }
    >({
      query: (args: {
        SECRET_UID: string;
        showIDs: any[];
        venueID: string;
      }) => ({
        method: "POST",
        url: "/venue/get-show-payout-status",
        body: args,
      }),
      providesTags: (result, error) => {
        console.log(result);
        return [{ type: "Show", id: result.showID }];
      },
    }),
    sendStripeReminder: builder.mutation<any, any>({
      query: (args: {
        SECRET_UID: string;
        venueID: string;
        id: string;
        showID: string;
      }) => ({
        method: "POST",
        url: "venue/send-stripe-reminder-email",
        body: args,
      }),
    }),
    sendPayment: builder.mutation<any, any>({
      query: (args: {
        paymentObject: object;
        SECRET_UID: string;
        venueID: string;
      }) => ({
        method: "POST",
        url: "/venue/send-payment",
        body: args,
      }),
      invalidatesTags: (result, error) => {
        return [{ type: "Show", id: result.showID }];
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateVenueMutation,
  useDeleteShowMutation,
  useSendStripeReminderMutation,
  useSendPaymentMutation,
  useCreateShowMutation,
  useEditVenueMutation,
  useUpdatePerformanceAgreementMutation,
  useGetShowNotesQuery,
  useEditShowNotesMutation,
  useCalculatePayoutsQuery,
  useGetShowPayoutStatusQuery,
  useGetSoldTicketsQuery,
  useRedeemTicketMutation,
  useEditShowMutation,
} = venueAPI;
