import React, { useEffect, useMemo } from "react";
import Img from "../Components/Images/Img";
import LandingSection from "../Images/Banners/LandingLocalStageBanner.png";
import LandingSectionGrayscale from "../Images/Banners/LandingShowrunnersBanner.jpg";

import Landing1 from "../Images/Landing/th_alt_landing.jpeg";
// import Landing1 from "../Images/Backgrounds/LandingBackground1.jpeg";
// import Landing2 from "../Images/Backgrounds/LandingBackground2.jpg";
// import Landing3 from "../Images/Backgrounds/LandingBackground3.jpg";
// import Landing4 from "../Images/Backgrounds/LandingBackground4.jpg";
// import Landing5 from "../Images/Backgrounds/LandingBackground5.jpg";
import BannerImage from "../Components/Images/BannerImage";
// import IconButton from "../Components/Buttons/IconButton";
// import TargetProfileButton from "../Components/Buttons/TargetProfileButton";
import TargetProfileButtonCollection from "../Components/Collections/TargetProfileButtonCollection";
import TargetHatched from "../Components/Collections/TargetHatched";
import { renderPageTitle } from "../Helpers/HelperFunctions";
import TopShows from "./Modals/TopShows";
import { useAppSelector } from "../hooks";
import Footer from "../Components/Footer";
import GeoPicker from "../Components/Buttons/GeoPicker";

export default function Landing() {
  const user = useAppSelector((state) => state.user.data);
  // const [LandingImage, setLandingImage] = useState(Landing1);
  const LandingImage = useMemo(() => Landing1, []);
  useEffect(() => {
    renderPageTitle("TuneHatch", true);
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="relative">
          <div className="hidden md:block absolute bg-white min-h-0 top-10 left-5 w-1/3 max-h-144 rounded-lg border-2 border-blue-400 overflow-scroll">
            <h1 className="text-2xl font-black p-2 text-center">
              Top Shows This Week
            </h1>
            <TopShows />
          </div>
          <Img
            src={LandingImage}
            className="w-11/12 mx-auto rounded-lg h-[81vh]"
            style={{ objectPosition: "69% 0%" }} 
          />
        </div>
        <h1 className="text-4xl font-black text-center m-4">
          Find and book better concerts
        </h1>
        <div className="mx-auto w-full">
      {/* <GeoPicker/> */}
      </div>
        <div className="block md:hidden bg-white min-h-0 top-10 left-5 w-11/12 mx-auto mb-4 max-h-144 rounded-lg border-2 border-blue-400 overflow-scroll">
          <h1 className="text-2xl font-black p-2 text-center">
            Top Shows This Week
          </h1>
          <TopShows />
        </div>
        <BannerImage height="h-auto" src={LandingSection}>
          <h1 className="text-4xl font-black text-center text-white mb-4">
            Trusted By Your Favorite Local Stages
          </h1>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-10 justify-center mb-4">
            <TargetProfileButtonCollection
              className="mx-auto w-20 h-20 md:w-32 md:h-32 rounded-full shadow-2xl border hover:shadow-3xl"
              type="venue"
              large
              ids={[
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                "17857582",
                //production IDs
                "4828362",
                "10316259",
                "29988469", //punk wok
                "30105866", //cabarays
                "99230",
                "4613185",
                "10208181",
                "45056",
                "3060099",
                "12778381",
                "12779759",
                "12778804",
                "15982909",
                "14759623",
                "15396932",
              ]}
            />
          </div>
        </BannerImage>
        <BannerImage height="h-auto" src={LandingSectionGrayscale}>
          <div className="p-4">
            <h1 className="text-4xl font-black text-center mb-4 flex-wrap text-black">
              Dynamic Showrunners
            </h1>
            <div className="flex justify-around">
              <TargetProfileButtonCollection
                className="mx-auto w-16 h-16 md:w-32 md:h-32 rounded-full shadow-2xl border hover:shadow-3xl"
                type="showrunner"
                large
                ids={[
                  "29245502",
                  "29245502",
                  "29245502",
                  "29245502",
                  "29245502",
                  //production IDs
                  "15334572", //studio rats
                  "15406895", //funky good time,
                  "15458923", //parallax,
                  "18614016", //men wear pink
                  "17087526", //artek
                ]}
              />
            </div>
          </div>
        </BannerImage>
        <div className="bg-orange p-4">
          <h1 className="text-4xl font-black text-center text-white">and</h1>
          <h1 className="text-6xl font-black text-center text-white">1000+</h1>
          <h1 className="text-4xl font-black text-center text-white">
            Nashville artists
          </h1>
          <div className="flex flex-wrap mt-2 gap-4 justify-around mb-2">
            <TargetProfileButtonCollection
              className="mx-auto w-16 h-16 md:w-32 md:h-32 rounded-full shadow-2xl border hover:shadow-3xl"
              type="artist"
              large
              ids={[
                "10201558",
                "10201558",
                "10201558",
                "10201558",
                "10201558",
                "10201558",
                "10201558",
                "10201558",
                // "10201558", "10201558",
                //production IDs
                "4164",
                "1439714",
                "6626019",
                "20070737",
                "20051248",
                "13221368",
                "12500036",
                "6666911",
                // "9868219",
                // "5741624",
                // "12656234",
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col items-center p-4">
          {!user.uid ? (
            <>
              <h1 className="text-3xl font-black text-center">
                Ready to join?
              </h1>
              <a
                className="text-center p-4 mt-2 mx-auto filter font-bold bg-orange hover:brightness-105 text-white rounded-full"
                href="/register"
              >
                Sign Up
              </a>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="p-4">
          <TargetHatched type="artist" />
        </div>
        <div className="p-4">
          <TargetHatched type="venue" />
        </div>
        <div className="bg-orange p-4 flex flex-col items-center">
          <h1 className="text-3xl font-black text-white text-center">
            Want to learn more about our story and mission?
          </h1>
          <a
            className="text-center p-4 mt-2 filter bg-white hover:bg-gray-10 rounded-full"
            href="/about"
          >
            About Us
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
