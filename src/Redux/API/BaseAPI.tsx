import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "../../Helpers/configConstants";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseAPI = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL + "/api" }),
  tagTypes: ["Show", "Artist", "Venue", "SRG", "Ticket", "Notification", "Region", "Message"],
  endpoints: () => ({}),
});
