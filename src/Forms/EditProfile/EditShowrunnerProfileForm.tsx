import React from "react";
import Form from "../../Components/Inputs/Form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BannerAvatarUpload from "../../Components/Inputs/InputTypes/BannerAvatarUpload";
import { useGetAllShowrunnerGroupsQuery } from "../../Redux/API/PublicAPI";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";
import { formAppend, formSplice } from "../../Redux/User/UserSlice";
import { useEditSRGMutation } from "../../Redux/API/ShowrunnerAPI";

export default function EditShowrunnerProfileForm(props: { id?: string }) {
  const dispatch = useAppDispatch();
  const SGID = props.id;
  // const user = useAppSelector((state) => state.user.data);
  const form = useAppSelector((state) => state.user.forms["editSRG"]);
  const srGroups = useGetAllShowrunnerGroupsQuery();
  const showrunner = srGroups.data?.[SGID];

  const [editSRG] = useEditSRGMutation();

  return (
    <LoadingWrapper queryResponse={[srGroups]} requiredData={[showrunner]}>
      <div className="flex flex-col mt-9 relative z-0">
        <BannerAvatarUpload
          form="editSRG"
          bannerField={"banner"}
          avatar={showrunner?.avatar}
          banner={showrunner?.banner}
        />
        <div className="flex flex-col">
          <h1 className="text-center text-4xl font-black">{showrunner?.name}</h1>
        </div>

        <Form
          name="editSRG"
          className="flex flex-wrap"
          keepOnDismount
          media
          submitFn={editSRG}
          doneLabel="Save"
          doneIcon="done"
          fixedNav
          formMap={[
            [
              {
                field: "SRID",
                defaultValue: showrunner?.SRID || showrunner?._key,
                hidden: true,
                required: true,
              },
              {
                fieldType: "title",
                className:
                  "w-full flex-col text-center text-sm text-gray-400 mt-2",
                defaultValue:
                  "Tell us about your promoter group, and tell us which artists are on your roster. If a member is not on TuneHatch, you will have the option to invite them.",
              },
              {
                field: "name",
                fieldType: "text",
                containerClassName: "w-full flex-grow",
                placeholder: "Group Name",
                large: true,
                defaultValue: showrunner?.name,
              },
              {
                field: "bio",
                fieldType: "textarea",
                containerClassName: "w-full",
                placeholder: "About",
                defaultValue: showrunner?.bio,
              },
              {
                form: "editSRG",
                field: "roster",
                label: "Your Roster:",
                placeholder: "Search for an artist...",
                fieldType: "filterInput",
                filterType: "artist",
                containerClassName: "flex w-full",
                defaultValue: showrunner?.members,
                value: form?.["roster"],
                selectFn: (e: any) =>
                  dispatch(
                    formAppend({ form: "editSRG", field: "roster", value: e })
                  ),
                removeFn: (e: any) =>
                  dispatch(
                    formSplice({
                      form: "editSRG",
                      field: "roster",
                      key: "name",
                      value: e,
                    })
                  ),
              },
              {
                fieldType: "title",
                className:
                  "w-full flex-col text-center text-2xl font-black mt-2",
                defaultValue: "Manager Contact",
              },
              {
                field: "contact.name",
                placeholder: "Contact Name",
                label: "Manager Contact",
                defaultValue: showrunner?.contact.name || "",
                required: true,
                containerClassName: "flex w-full",
              },
              {
                field: "contact.email",
                placeholder: "Contact Email",
                label: "Contact Email",
                defaultValue: showrunner?.contact.email || "",
                type: "email",
                required: true,
                containerClassName: "flex w-full",
              },
              {
                field: "contact.phone",
                placeholder: "Contact Phone",
                label: "Contact Phone *",
                defaultValue: showrunner?.contact.phone || "",
                type: "tel",
                required: true,
                containerClassName: "flex w-full",
              },
              {
                fieldType: "title",
                className:
                  "w-full flex-col text-center text-2xl font-black mt-2",
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
                field: "socials.spotifyLink",
                label: "Spotify",
                placeholder: "Spotify",
                containerClassName: "flex w-1/2 pr-1",
                className: "text-xs",
                defaultValue: showrunner?.socials.spotifyLink,
              },
              {
                field: "socials.instagram",
                label: "Instagram",
                placeholder: "Instagram",
                containerClassName: "flex w-1/2 pr-1",
                className: "text-xs",
                defaultValue: showrunner?.socials.instagram,
              },
              {
                field: "socials.youtubeLink",
                label: "Youtube",
                placeholder: "Youtube",
                containerClassName: "flex w-1/2 pr-1",
                className: "text-xs",
                defaultValue: showrunner?.socials.youtubeLink,
              },
              {
                field: "socials.tiktokLink",
                label: "TikTok",
                placeholder: "TikTok",
                containerClassName: "flex w-1/2 pr-1",
                className: "text-xs",
                defaultValue: showrunner?.socials.tiktokLink,
              },
            ],
          ]}
        />
      </div>
    </LoadingWrapper>
  );
}
