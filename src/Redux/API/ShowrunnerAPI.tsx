import { baseAPI } from "./BaseAPI";

export const showrunnerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createSRG: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/user/create-sr-group",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "SRG" }],
    }),
    editSRG: builder.mutation<any, any>({
      query: (args) => ({
        method: "POST",
        url: "/sr/edit-sr-group",
        body: args,
      }),
      invalidatesTags: (result, error) => [{ type: "SRG" }],
    }),
  }),

  overrideExisting: false,
});

export const { useCreateSRGMutation, useEditSRGMutation } = showrunnerAPI;
