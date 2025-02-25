import React from "react";
import dayjs from "dayjs";
import Form from "../../Components/Inputs/Form";
import { useAppSelector } from "../../hooks";
import { useEditProfileMutation } from "../../Redux/API/UserAPI";
import BannerAvatarUpload from "../../Components/Inputs/InputTypes/BannerAvatarUpload";
import { getDisplayName } from "../../Helpers/HelperFunctions";

export default function EditArtistProfileForm() {
  const [editProfile] = useEditProfileMutation();

  const user = useAppSelector((state) => state.user.data);

  return (
    <div className="flex flex-col mt-9 relative z-0">
      <BannerAvatarUpload
        form="editProfile"
        bannerField={"type.artist.banner"}
        avatar={user.avatar}
        banner={user.type.artist.banner}
      />
      <div className="flex flex-col">
        <h1 className="text-center text-4xl font-black">
          {getDisplayName("user", user)}
        </h1>
        <p className="text-xs text-gray-400">
          TuneHatch Artist since {dayjs(user.created).format("MMMM DD, YYYY")}
        </p>
      </div>

      <Form
        name="editProfile"
        className="flex flex-wrap"
        keepOnDismount
        media={true}
        submitFn={editProfile}
        doneLabel="Save"
        doneIcon="done"
        fixedNav
        formMap={[
          [
            {
              fieldType: "dropdown",
              field: "type.artist.genre",
              label: "Genre:",
              defaultValue: user?.type?.artist?.genre,
              containerClassName: "flex flex-col mt-4 font-black",
              className: "pr-1",
              optionMap: {
                rock: "Rock",
                pop: "Pop",
                metal: "Metal",
                hip_hop: "Hip Hop",
                jazz: "Jazz",
                country: "Country",
                electronic: "Electronic",
                indie: "Indie",
                other: "other",
              },
            },
            {
              field: "type.artist.subgenre",
              label: "Subgenre",
              placeholder: "Subgenre",
              defaultValue: user?.type?.artist?.subgenre,
              containerClassName: "flex w-1/2 pr-1 pl-1",
            },
            {
              field: "type.artist.stagename",
              fieldType: "text",
              label: "Stage Name",
              placeholder: "Stage Name",
              defaultValue: user?.type?.artist?.stagename,
              clickToEnable: !user.type?.artist?.stagename,
              containerClassName: "flex w-full",
            },
            {
              field: "bio",
              fieldType: "textarea",
              label: "About",
              placeholder: "About",
              defaultValue: user?.bio,
              containerClassName: "flex w-full p-2 mt-2",
            },
            {
              field: "primaryCity",
              fieldType: "place",
              label: "Primary City",
              defaultValue: user?.primaryCity,
            },
            {
              field: "secondaryCity",
              fieldType: "place",
              label: "Secondary City",
              defaultValue: user?.secondaryCity,
            },
            {
              fieldType: "title",
              className: "w-full flex-col text-center text-2xl font-black mt-2",
              defaultValue: "Social Content",
            },
            {
              fieldType: "title",
              className:
                "w-full flex-col text-center text-sm text-gray-400 mt-2",
              defaultValue:
                "TuneHatch allows you to dynamically display your favorite content from social media directly on your profile. Add items below to see them automatically added.",
            },
            {
              field: "type.artist.socials.spotifyLink",
              label: "Spotify",
              placeholder: "Spotify",
              containerClassName: "flex w-1/2 pr-1",
              className: "text-xs",
              defaultValue: user?.type?.artist?.socials?.spotifyLink,
            },
            {
              field: "type.artist.socials.instagram",
              label: "Instagram",
              placeholder: "Instagram",
              containerClassName: "flex w-1/2 pr-1",
              className: "text-xs",
              defaultValue: user?.type?.artist?.socials?.instagram,
            },
            {
              field: "type.artist.socials.youtubeLink",
              label: "Youtube",
              placeholder: "Youtube",
              containerClassName: "flex w-1/2 pr-1",
              className: "text-xs",
              defaultValue: user?.type?.artist?.socials?.youtubeLink,
            },
            {
              field: "type.artist.socials.tikTokLink",
              label: "TikTok",
              placeholder: "TikTok",
              containerClassName: "flex w-1/2 pr-1",
              className: "text-xs",
              defaultValue: user?.type?.artist?.socials?.tikTokLink,
            },
            {
              field: "type.artist.enabled",
              placeholder: "Enable Artist Features",
              fieldType: "toggleSlider",
              defaultValue: user.type?.artist?.enabled,
            },
          ],
        ]}
      />
    </div>
  );
}
