import React from "react";
import { Type } from "../../../Helpers/shared/Models/Type";
import Img from "../../Images/Img";
// import { getDisplayName } from "../../../Helpers/HelperFunctions";
import YouTubeEmbed from "../../Embeds/YouTubeEmbed";
import ShowCard from "../../Cards/ShowCard/ShowCard2";
import { UserProfileDisplay } from "../../../Helpers/shared/Models/ProfileDisplay";

export default function TargetHatchedDisplay(props: {
  type: Type;
  target: UserProfileDisplay;
  bio: string;
  show: string;
  video: string;
}) {
  return (
    props.target && (
      <>
        <h1 className="text-3xl font-black capitalize">Hatched {props.type}</h1>
        <div className="w-full border grid grid-cols-12 h-auto rounded items-center gap-4 p-4 mt-4">
          <div className="text-center col-span-12 md:col-span-6 lg:col-span-3 flex flex-col items-center">
            <Img
              src={props.target?.avatar}
              className="w-32 h-32 mx-auto rounded-full"
            />
            <h2 className="text-2xl font-black mt-2">
              {props.target.displayName}
            </h2>
            <p>{props.bio}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <YouTubeEmbed
              height="aspect-video rounded-lg max-h-[18rem] "
              link={props.target.socials.youtubeLink}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ShowCard showID={props.show} />
          </div>
        </div>
      </>
    )
  );
}
