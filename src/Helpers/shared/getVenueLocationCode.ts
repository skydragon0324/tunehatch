import { Venue } from "./Models/Venue";

export function getVenueLocationCode(venue: Venue | null) {
    const venueLocationCode = venue?.location?.metadata
      ? venue?.["location"]?.["metadata"]?.["address_components"]?.find(
          (c: any) => c.types.includes("locality")
        ).long_name +
        ", " +
        venue?.["location"]?.["metadata"]?.["address_components"]?.find(
          (c: any) => c.types.includes("administrative_area_level_1")
        )?.short_name
      : "";
    return venueLocationCode;
  }
  