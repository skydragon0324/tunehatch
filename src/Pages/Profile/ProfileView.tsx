import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import BannerImage from "../../Components/Images/BannerImage";
import Img from "../../Components/Images/Img";
import Button from "../../Components/Buttons/Button";
import { openModal } from "../../Redux/UI/UISlice";
import DisplayCard from "../../Components/Cards/DisplayCard";
import InstagramEmbed from "../../Components/Embeds/InstagramEmbed";
import SpotifyEmbed from "../../Components/Embeds/SpotifyEmbed";
import TikTokEmbed from "../../Components/Embeds/TikTokEmbed";
import YouTubeEmbed from "../../Components/Embeds/YouTubeEmbed";
import { APIURL } from "../../Helpers/configConstants";
import ArtistCard from "../../Components/Cards/ArtistCard/ArtistCard";
import ShowTileCollection from "../../Components/Collections/ShowTileCollection";
import TargetCardCollection from "../../Components/Collections/TargetCardCollection";
import BadgeDisplay from "../../Components/Badges/BadgeDisplay";
import Badge from "../../Components/Badges/Badge";
import { BADGES, IBadge } from "../../Helpers/shared/badgesConfig";
// import IconButton from "../../Components/Buttons/IconButton";
import InstagramLogo from "../../Images/Icons/Instagram.png";
// import { useAppDispatch } from "../../hooks";
import StatsDisplay from "../../Components/Badges/StatsDisplay";
import IconLabel from "../../Components/Labels/IconLabel";
import { renderPageTitle } from "../../Helpers/HelperFunctions";
import StripeHandler from "../../Components/Buttons/StripeHandler";
import axios from "axios";
import { Show, application } from "../../Helpers/shared/Models/Show";
// import { Venue } from "../../Helpers/shared/Models/Venue";
import { IStat } from "../../Helpers/shared/statsConfig";

type Socials = {
  instagram?: string;
  spotifyLink?: string;
  tikTokLink?: string;
  youtubeLink?: string;
};

interface IProfileViewProps {
  id?: string;
  self: boolean;
  user?: any;
  about?: string;
  socials?: Socials;
  banner?: string;
  type: string;
  avatar?: string;
  displayName?: string;
  badges?: IBadge[];
  primaryCity?: React.ReactNode;
  stats?: IStat[];
  socialStats?: IStat[];
  roster?: string[];
  images?: string[];
  shows?: Show[];
  venues?: string[];
  genre?: string;
  subgenre?: string;
  secondaryCity?: string;
  applications?: application<any>[];
}

export default function ProfileView(props: IProfileViewProps) {
  // const dispatch = useAppDispatch();
  const containerRef = useRef(null);
  const { type, shows, venues, applications, self } = props;
  const hasShows = shows && shows.length > 0;
  const hasVenues = venues && venues.length > 0;
  const hasApplications = applications && applications.length > 0;

  const [lineCount, setLineCount] = useState(1);
  const [limit, setLimit] = useState(5);
  const [calculatedLineLength, setCalculatedLineLength] = useState(
    window.innerWidth > 768 ? 90 : 50
  );
    const currentLocation = window.location.href;
    const destinationLink = (props.type === "artist" && "/profile/u/" + props.id) ||
    (props.type === "venue" && "/profile/v/" + props.id) || (props.type === "showrunner" && "/profile/g/" + props.id)
  const canApply = shows?.map((show: any) => {
    if (show.performers.some((performer: any) => performer.uid === props.id)) {
      return false;
    } else {
      return true;
    }
  });

  useEffect(() => {
    if (props.self) {
      renderPageTitle(
        props.user.stagename || props.user.firstname + " " + props.user.lastname
      );
    }
  });

  const handleResize = () => {
    setCalculatedLineLength(window.innerWidth > 640 ? 90 : 50);
  };

  useEffect(() => {
    if (props.about) {
      const updatedLines = splitTextIntoLines(
        props.about,
        calculatedLineLength
      );
      setLimit(Math.min(updatedLines.length, limit));
    }
  }, [props.about, calculatedLineLength, limit]);

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup: Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (props.about) {
      // Calculate the number of lines based on the container height when the component mounts
      const calculateLines = () => {
        const lineHeight = parseInt(
          getComputedStyle(containerRef.current).lineHeight
        );
        const containerHeight = containerRef.current.scrollHeight;
        const lines = Math.round(containerHeight / lineHeight);
        setLineCount(lines);
      };

      // Update the line count when the component mounts
      calculateLines();

      // Cleanup: Remove event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", calculateLines);
      };
    }
  }, [props.about]);

  const handleShowMore = () => {
    setLimit(lines.length);
  };

  const handleShowLess = () => {
    setLimit(5);
  };

  useEffect(() => {
    if (type === "artist" && props.id) {
      axios.post(APIURL + "refresh-artist-data", { artistID: props.id });
    }
  }, [type, props.id]);

  function splitTextIntoLines(text: string, lineLength: number) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length <= lineLength) {
        currentLine += (currentLine === "" ? "" : " ") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine !== "") {
      lines.push(currentLine);
    }

    return lines;
  }

  const lines = props.about
    ? splitTextIntoLines(props.about, calculatedLineLength)
    : [];

  // Check if InstagramEmbed is null or undefined
  const instagramEmbed = (
    <InstagramEmbed instagram={props.socials?.instagram} />
  );
  const instagramContent =
    instagramEmbed !== null && instagramEmbed !== undefined
      ? instagramEmbed
      : null;

  return (
    <div className="@container">
      <BannerImage
        localSrc={props.banner}
        src={props.banner}
        height="h-1/4-screen"
        gradientAlt
        hideHatchy
        blackAlt
      >
        {/* coming back to this - we need this to only be visible when it's the sidebar view */}
        {/* <div className="bg-blue-50 w-8"> */}
        {/* anchor or btn? */}
        {/* for non-legacy? `${"profile/" + props.type + "/" + props.id}` ||  */}
        {!currentLocation.includes(destinationLink) && <a
          href={
            destinationLink
          }
          target="blank"
        >
          <i className={"material-symbols-outlined text-md text-white rotate-90"}>
            open_in_full
          </i>
        </a>}
        {/* <IconButton icon="move_group" iconColor="text-white" onClick={() => {
          dispatch(resetSidebar())}}/> */}
        {/* </div> */}
        <div className="flex flex-col">
          <Img
            src={props.avatar}
            className="w-48 h-48 mx-auto mb-2 bg-white rounded-full"
          />
          <h1 className="text-4xl flex justify-center items-center text-center font-black text-black">
            <span className="bg-white p-2 mt-1 rounded-lg mb-2 flex items-center">
              {props.displayName}{" "}
              {(type === "artist" || type === "user") &&
                props.badges?.filter(
                  (badge: any) => badge.name === "hatched"
                )?.[0] && (
                  <div className="transform scale-50">
                    <Badge badge={BADGES[0]} />
                  </div>
                )}
            </span>
          </h1>
          <div className="flex flex-col">
            <div className="flex justify-center gap-2">
              {props.primaryCity && (
                <>
                  <IconLabel
                    icon="location_on"
                    className="rounded-full p-1 pl-2 pr-2 flex items-center justify-center flex-shrink bg-blue-400 text-center text-white"
                  >
                    {props.primaryCity}
                  </IconLabel>
                </>
              )}
              {props.socials?.instagram && (
                <a
                  href={`https://instagram.com/${props.socials.instagram}`}
                  rel="noreferrer"
                  target="blank"
                >
                  <span className="shadow flex bg-white p-1 border rounded-full hover:bg-gray-200 items-center justify-center">
                    <div className="flex items-center">
                      <Img src={InstagramLogo} className="ml-2 h-4 w-4" />
                    </div>
                    <div className="flex justify-center items-center">
                      <p className={`text-center pr-2 pl-1 cursor-pointer`}>
                        View Instagram
                      </p>
                    </div>
                  </span>
                </a>
              )}
            </div>
            {props.self && props.type === "showrunner" ? (
              <div className="flex m-2 justify-center items-center gap-2">
                <Button
                  action={openModal({
                    status: true,
                    component: "EditShowrunnerProfileForm",
                    data: { SRID: props.id },
                  })}
                >
                  Edit Profile
                </Button>
                <StripeHandler viewType="showrunner" targetID={props.id} />
              </div>
            ) : (
              <></>
            )}
            {!props.self && (props.type === "artist" || props.type === "venue" || props.type === "showrunner") ? <>
            <div className="flex m-2 justify-center items-center gap-2">
            <Button
                link={`/message/new/${props.type}/${props.id}`}
                >
                  Send Message
                </Button>
                </div>
            </> : <></>}
            {props.self &&
            (props.type === "user" || props.type === "artist") ? (
              <div className="flex m-2 justify-center items-center gap-2">
                <Button
                  action={openModal({ status: true, component: "EditProfile" })}
                >
                  Edit Profile
                </Button>
                {props.type === "artist" && (
                  <StripeHandler viewType="artist" targetID={props.id} />
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </BannerImage>
      <div className="grid grid-cols-1 p-2 gap-2">
        {props.badges?.length ? (
          <BadgeDisplay
            className="justify-center items-center flex flex-wrap gap-5 p-3"
            badges={props.badges}
          />
        ) : (
          <></>
        )}
        <div className="grid grid-cols-2 gap-2">
          {props.stats?.length && (
            <StatsDisplay
              className="w-full self-start justify-center"
              stats={props.stats}
            />
          )}
          {props.socialStats?.length && (
            <StatsDisplay
              className="w-full self-start @2xl justify-center"
              title="Socials"
              stats={props.socialStats}
            ></StatsDisplay>
          )}
        </div>
        <div
          ref={containerRef}
          style={{ overflowY: "auto" }}
          className="grid grid-cols-6 @2xl:grid-cols-12 gap-4 mt-2"
        >
          <DisplayCard
            title={`About ${props.displayName}`}
            titleColor="text-white"
            containerClassName="@2xl:col-span-12 col-span-6"
            className="p-2"
            color="bg-orange"
          >
            {props.type === "artist" && (props.subgenre || props.genre) && (
              <>
                <p className="flex items-center"><i className="material-symbols-outlined mr-1">
                  music_note
                </i>
                Genre &nbsp;<span className="font-bold capitalize">{props.subgenre || props.genre}</span></p>
              </>
            )}
            {props.type === "artist" && props.primaryCity && (
              <>
                <p className="flex items-center">
                <i className="material-symbols-outlined mr-1">
                  home
                </i>
                Primary City &nbsp;<span className="font-bold">{props.primaryCity}</span></p>
              </>
            )}
            {props.type === "artist" && props.secondaryCity && (
              <>
                <p className="flex items-center">
                <i className="material-symbols-outlined mr-1">
                  location_on
                </i>
                Secondary City &nbsp;<span className="font-bold">{props.secondaryCity}</span></p>
              </>
            )}
            {props.about && (
              <>
                {/* Display the content up to the current limit */}
                <p className="mt-2 w-full">
                {lines.slice(0, limit).map((line, index) => (
                  <>&nbsp;{line}{lines?.length > limit && index === limit - 1 ? "..." : ""}</>
                ))}
                </p>
                {/* Show the "Show More" button if there are more lines to display */}
                {lines.length > limit && (
                  <>
                    <button
                      className="p-3 hover:bg-gray-100 w-full text-blue-400"
                      onClick={handleShowMore}
                    >
                      Show More
                    </button>
                  </>
                )}
                {/* Show the "Show Less" button if fully expanded */}
                {limit > 5 && limit !== 5 && (
                  <button
                    className="p-3 hover:bg-gray-100 w-full text-red-400"
                    onClick={handleShowLess}
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </DisplayCard>
          {props.socials?.spotifyLink && (
            <SpotifyEmbed
              className="col-span-6 justify-center items-center"
              link={props.socials.spotifyLink}
            />
          )}
          {(type === "user" || "artist" || "venue" || "showrunner") && (
            <DisplayCard
              title={"Upcoming Shows"}
              containerClassName="col-span-6"
              color="bg-blue-200"
            >
              {hasShows ? (
                <ShowTileCollection
                  className=""
                  detailsOnClick
                  useModal
                  shows={shows}
                  self={props.self}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-center">
                    This{" "}
                    {type === "artist"
                      ? "artist"
                      : type === "user"
                      ? "fan"
                      : type === "venue"
                      ? "venue"
                      : type === "showrunner"
                      ? "showrunner"
                      : ""}{" "}
                    does not have any upcoming shows on TuneHatch right now.{" "}
                    <br />
                    <br /> Check back soon!
                  </p>
                </div>
              )}
            </DisplayCard>
          )}
          {type === "showrunner" && hasApplications && (
            <DisplayCard
              title={"Upcoming Applications"}
              containerClassName="col-span-6"
              className=""
            >
              <div className="flex flex-col">
                <ShowTileCollection
                  className=""
                  shows={shows}
                  canApply={canApply && self}
                />
              </div>
              : <></>
            </DisplayCard>
          )}
          {props.socials?.instagram && !instagramContent && (
            <DisplayCard title={"Instagram"} containerClassName="col-span-6">
              <InstagramEmbed instagram={props.socials.instagram} />
            </DisplayCard>
          )}
          {props.socials?.tikTokLink && (
            <DisplayCard
              title={"TikTok"}
              className="p-2"
              containerClassName="col-span-6"
              color={"bg-teal-100"}
            >
              <TikTokEmbed link={props.socials.tikTokLink} />
            </DisplayCard>
          )}
          {props.socials?.youtubeLink && (
            <DisplayCard
              title={"Featured Youtube Video"}
              containerClassName="@2xl:col-span-12 col-span-6"
              color="bg-purple-400"
            >
              <YouTubeEmbed link={props.socials.youtubeLink} />
            </DisplayCard>
          )}
          {type === "showrunner" && (
            <DisplayCard
              title={"Artists We Work With"}
              containerClassName="col-span-6 @2xl:col-span-12"
              className="p-2"
            >
              {props.roster?.length ? (
                <div className=" gap-2 flex flex-row overflow-x-auto">
                  {props.roster.map((artistID: any, i: number) => {
                    if (artistID) {
                      return <ArtistCard key={artistID + i} id={artistID} />;
                    } else {
                      return null;
                    }
                  })}
                </div>
              ) : (
                <></>
              )}
            </DisplayCard>
          )}
          {props.images && type === "venue" && (
            <DisplayCard
              title={"Gallery"}
              className="p-2"
              containerClassName="col-span-6"
            >
              {props.images.length ? (
                <div
                  className={`flex flex-wrap ${
                    window.innerWidth > 768 ? "min-w-full" : "min-w-0"
                  }`}
                >
                  {props.images.map((image: string, i: number) => {
                    return (
                      <div
                        key={"venueImages/" + i}
                        className="flex-shrink-0 m-2"
                      >
                        {image && (
                          <Img
                            src={image}
                            alt="venue image"
                            className="w-full h-auto object-cover rounded-lg"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-center">
                    We don't have any photos of {props.displayName} yet.
                  </p>
                </div>
              )}
            </DisplayCard>
          )}
          {hasVenues && (
            <DisplayCard
              title={"Venues We Work With"}
              containerClassName="col-span-6"
              className="p-2"
            >
              <div className="flex flex-col">
                <TargetCardCollection type="venue" ids={venues} />
              </div>
            </DisplayCard>
          )}
        </div>
      </div>
    </div>
  );
}
