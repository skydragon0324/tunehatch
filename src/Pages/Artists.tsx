import React, { useEffect, useState } from "react";

import { useGetAllArtistsQuery } from "../Redux/API/PublicAPI";
import ArtistCard from "../Components/Cards/ArtistCard/ArtistCard";
import TargetCategory from "../Components/Collections/TargetCategory";
import CoverImage from "../Images/Banners/artistbanner.jpeg";
import {
  sortByPerformanceCount,
  sortByVenueCount,
} from "../Helpers/SortingFunctions/ArtistSortingFunctions";
import Pagination from "../Components/Layout/Pagination";
import { objToArray, renderPageTitle } from "../Helpers/HelperFunctions";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import {
  GENRE_MAP,
  // TH_GENRES,
  TH_SAFE_GENRES,
} from "../Helpers/configConstants";
import BannerImage from "../Components/Images/BannerImage";
import { useAppSelector } from "../hooks";
import Button from "../Components/Buttons/Button";
import Img from "../Components/Images/Img";
import HatchedIcon from "../Images/Badges/HatchedArtist.png";
import SpotifyIcon from "../Images/Icons/Spotify.png";
import InstagramIcon from "../Images/Icons/InstagramFull.png";
import TikTokIcon from "../Images/Icons/TikTokFull.png";

export default function Artists() {
  const user = useAppSelector((state) => state.user.data);
  const artists = useGetAllArtistsQuery();
  const [artistArray, setArtistArray] = useState(
    objToArray(artists?.data || {}).filter((artist) => artist?.avatar)
  );
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [search, updateSearch] = useState("");

  useEffect(() => {
    renderPageTitle("Artists");
  });

  useEffect(() => {
    setArtistArray(
      objToArray(artists?.data || {}).filter((artist) => artist?.avatar)
    );
  }, [artists.data]);

  useEffect(() => {
    const filteredArtists = objToArray(artists?.data || {}).filter((artist) => {
      const fullName = `${artist.firstname} ${artist.lastname}`;
      const lowerCaseFullName = fullName.toLowerCase();
      // Check if stagename is defined and call toLowerCase
      const lowerCaseStagename =
        artist.stagename && artist.stagename.toLowerCase
          ? artist.stagename.toLowerCase()
          : "";

      return (
        lowerCaseFullName.includes(search.toLowerCase()) ||
        lowerCaseStagename.includes(search.toLowerCase())
      );
    });
    setArtistArray(filteredArtists.length > 0 ? filteredArtists : []);
    setArtistsLoading(false);
  }, [search]);

  return (
    <>
      <LoadingWrapper
        noEmptyArrays
        isLoading={artistsLoading}
        requiredData={[artistArray]}
      >
        <section className="w-full">
          <BannerImage
            src={CoverImage}
            blackAlt
            height="h-auto md:h-[50vh]"
            imageStyle={{ objectPosition: "25% 70%" }}
          >
            <div className="flex flex-col w-3/5 md:w-1/2 h-full gap-2 pr-3 justify-center mr-0 ml-auto">
              <h1 className="text-4xl md:text-5xl font-black md:text-white text-white">
                Get Booked
                <span className="hidden md:inline"> and Grow Your Career</span>
              </h1>
              <div className="flex flex-row gap-3 mt-2 mb-2 flex-wrap">
                <Img src={HatchedIcon} className="rounded-full w-8 h-8" />
                <Img src={SpotifyIcon} className="rounded-full  w-8 h-8" />
                <Img src={InstagramIcon} className="rounded-full  w-8 h-8" />
                <Img src={TikTokIcon} className="rounded-full  w-8 h-8" />
              </div>
              <div className="w-full md:w-full">
                <h4 className="text-lg font-medium md:text-white text-white">
                  Explore and book over 1,000 Nashville artists
                </h4>
              </div>
              <div className="flex gap-3">
                {!user.uid && <Button link={`/register`}>Sign Up</Button>}
              </div>
            </div>
          </BannerImage>
        </section>
        <div className="flex flex-wrap gap-4 justify-center">
          <TargetCategory
            hideIfHatchy
            title="Hatched"
            type="artist"
            conditionFn={(artist) => artist.stripeEnabled === true}
            maxLength={8}
          />
          {/* <TargetCategory title="Spotify Stars" type="artist" conditionFn={(artist) => artist.spotifyScore >= 0} maxLength={8} /> */}
          <TargetCategory
            hideIfHatchy
            title="Most Shows"
            type="artist"
            sortFn={sortByPerformanceCount}
            maxLength={8}
          />
          <TargetCategory
            hideIfHatchy
            title="Most Venues"
            type="artist"
            sortFn={sortByVenueCount}
            maxLength={8}
          />
          {TH_SAFE_GENRES.map((genre, i) => {
            return (
              <TargetCategory
                hideIfHatchy
                title={GENRE_MAP[genre]}
                type="artist"
                conditionFn={(artist: any) =>
                  artist?.type?.artist?.genre === genre
                }
                maxLength={14}
                minLength={4}
              />
            );
          })}
          <div className="w-3/4 p-2 flex flex-row">
            <input
              className="border rounded-md border-gray-200 w-full p-2 text-center text-lg"
              placeholder="Search Artists..."
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
            />
            {search && (
              <button
                className="ml-2 px-4 py-2 w-1/4 bg-blue-500 text-white rounded-md"
                onClick={() => updateSearch("")}
              >
                Reset
              </button>
            )}
          </div>
          {artists.data && artistArray.length > 0 ? (
            <Pagination
              title={
                <h1 className="text-2xl pl-2 mb-1 font-black">All Artists</h1>
              }
              endMessage="That's all we have for TuneHatch artists in your area. Check back soon!"
              items={artistArray}
              limit={20}
              indexKey="_key"
              containerClassName="flex flex-wrap gap-4 justify-center"
              generatorFn={(e: string) => {
                return <ArtistCard id={e} hideIfHatchy />;
              }}
            />
          ) : (
            <div className="w-1/2 p-2 mb-2 flex flex-col">
              <p className="text-xl text-gray-500 mt-8 mb-8">
                {artistsLoading
                  ? "Loading..."
                  : artistArray.length === 0 && search
                  ? "Sorry, no artists were found for the given search."
                  : "That's all."}
              </p>
            </div>
          )}
        </div>
      </LoadingWrapper>
    </>
  );
}
