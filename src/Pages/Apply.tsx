import React, { useEffect, useRef, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../hooks";
import {
  useGetAllShowsQuery,
  // useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
// import ShowCard from "../Components/Cards/ShowCard";
import CoverImage from "../Images/Banners/applybanner.jpeg";
import BannerImage from "../Components/Images/BannerImage";
// import Img from "../Components/Images/Img";
// import IconButton from "../Components/Buttons/IconButton";
// import ShowCard2 from "../Components/Cards/ShowCard/ShowCard2";
// import Card from "../Components/Layout/Card";
// import Button from "../Components/Buttons/Button";
// import { openSidebar } from "../Redux/UI/UISlice";
// import FeaturedShowBanner from "../Components/Collections/FeaturedShowBanner";
import { renderPageTitle } from "../Helpers/HelperFunctions";
import ShowSorter from "../Components/Layout/ShowSorter/ShowSorter";
import TargetProfileButton from "../Components/Buttons/TargetProfileButton";
import { useAppSelector } from "../hooks";

export default function Apply() {
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  // const venues = useGetAllVenuesQuery();

  const [activeVenue, setActiveVenue] = useState(null);
  const iconRef = useRef(null);

  // const selectVenue = (venueID) => {
  //   setActiveVenue(venueID);
  // };

  useEffect(() => {
    renderPageTitle("Apply");
  }, []);

  useEffect(() => {
    const handleVenueClick = (event: MouseEvent) => {
      // Check if the icon target and not the Card
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setActiveVenue(null);
      }
    };
    document.addEventListener("click", handleVenueClick);

    // Remove the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleVenueClick);
    };
  }, []);
  // todo: filter shows
  // const [showFilter, setShowFilter] = React.useState<string[]>([]);

  return (
    <LoadingWrapper queryResponse={[shows]}>
      <BannerImage
        src={CoverImage}
        height="h-auto md:h-[50vh]"
        imageStyle={{ objectPosition: "70% 5%" }}
      >
        <div className="w-1/2 h-full flex flex-col justify-center gap-3">
          <h1 className="text-3xl md:text-5xl md:leading-tight pl-4 font-black text-white">
            <>Apply to play at Springwater</>
          </h1>
          <TargetProfileButton type="venue" id="99230" />
        </div>
      </BannerImage>
      {!user?.displayUID ? (
        <>
          <div className="w-10/12 mx-auto bg-orange rounded-md mt-4 p-4 pt-2 text-white">
            <h1 className="text-2xl font-black text-center m-2">
              Register for TuneHatch to apply to gigs
            </h1>
            <p className="text-center">
              You must be logged in to TuneHatch as an artist to apply for
              upcoming gigs. If you don't have an account, you can{" "}
              <a className="text-white underline" href="/register">
                sign up here.
              </a>
            </p>
          </div>
        </>
      ) : (
        !user?.type?.artist?.enabled && (
          <>
            <div className="w-10/12 mx-auto bg-orange rounded-md mt-4 p-4 pt-2 text-white">
              <h1 className="text-2xl font-black text-center m-2">
                Ready to play? Activate your artist profile.
              </h1>
              <p className="text-center">
                To apply for open gigs on TuneHatch, you need to activate your
                artist account. You can do this for free from{" "}
                <a className="text-white underline" href="/profile">
                  your profile.
                </a>
              </p>
            </div>
          </>
        )
      )}
      <ShowSorter gigs />
    </LoadingWrapper>
  );
}
