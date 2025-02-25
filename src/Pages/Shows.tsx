import React from "react";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import BannerImage from "../Components/Images/BannerImage";
import CoverImage from "../Images/Banners/showsbanner.png";
import FeaturedShowBanner from "../Components/Collections/FeaturedShowBanner";
import ShowSorter from "../Components/Layout/ShowSorter/ShowSorter";

export default function Shows() {
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  return (
    <LoadingWrapper queryResponse={[shows, venues]}>
      <section className="w-full">
        <BannerImage
          src={CoverImage}
          height="h-auto h-[59vh] md:h-[50vh]"
          imageStyle={{ objectPosition: "100% 50%" }}
        >
          <FeaturedShowBanner
            showID="30098121"
            // "32731557"
          />
        </BannerImage>
      </section>
      <ShowSorter />
    </LoadingWrapper>
  );
}
