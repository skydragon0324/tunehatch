import RegionInfo from "../../Helpers/shared/Models/RegionInfo";
import { baseAPI } from "./BaseAPI";

export const regionAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getActiveRegions: builder.query<Array<RegionInfo>, void>({
        query: () => "/get-active-regions",
        providesTags: (result) =>
          Object.keys(result).map((res) => {
            return {
              type: "Region",
              id: res,
            };
          }),
      }),
  }),

  overrideExisting: false,
});

export const { useGetActiveRegionsQuery } = regionAPI;
