import React from "react";
import Form from "../Components/Inputs/Form";
import { useAppSelector, useAppDispatch } from "../hooks";
import { useCreateVenueMutation } from "../Redux/API/VenueAPI";
import { openModal } from "../Redux/UI/UISlice";
import BannerAvatarUpload from "../Components/Inputs/InputTypes/BannerAvatarUpload";

export default function CreateVenueForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const [createVenue] = useCreateVenueMutation();
  return (
    <div className="flex flex-col mt-9 relative z-0">
      <BannerAvatarUpload
        form="createVenue"
        bannerField={"banner"}
        avatar={user.avatar}
        banner={user.type.host.banner}
      />
      <Form
        name="createVenue"
        className="flex flex-wrap w-full"
        fixedNav
        media
        doneLabel="Create"
        completedLabel="Created!"
        submitFn={createVenue}
        onComplete={() => dispatch(openModal({ status: false }))}
        clearOnComplete={true}
        formMap={[
          [
            {
              fieldType: "title",
              defaultValue: "Venue Details",
              className: "text-2xl font-black items-center p-2",
            },
            {
              field: "name",
              placeholder: "Venue Name",
              label: "Venue Name",
              large: true,
              required: true,
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              field: "description",
              placeholder: "Venue Description",
              fieldType: "textarea",
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              field: "location.address",
              metaField: "locationData",
              fieldType: "place",
              required: true,
              containerClassName: "w-full p-2",
              className: "w-full border border-gray-200 rounded-md",
              locationTypes: [],
              clickToEnable: true,
              label: "Address",
              icon: "settings",
            },
            {
              field: "capacity",
              label: "Capactiy",
              placeholder: "Capacity",
              fieldType: "number",
              required: true,
              containerClassName:
                "flex w-40 h-14 border border-gray-200 rounded-md m-2",
            },
            {
              field: "min_age",
              placeholder: "Minimum Age",
              label: "Minimum Age",
              type: "number",
              defaultValue: "21",
              required: true,
              containerClassName:
                "flex w-40 h-14  border border-gray-200 rounded-md m-1",
            },
            {
              field: "phone",
              placeholder: "Phone Number",
              label: "Phone Number",
              type: "tel",
              required: true,
              containerClassName:
                "flex w-40 h-14 pr-1 border border-gray-200 rounded-md m-2",
            },
            {
              field: "email",
              placeholder: "Email",
              label: "Contact Email",
              type: "email",
              required: true,
              containerClassName:
                "flex w-40 h-14  pr-1 border border-gray-200 rounded-md m-2",
            },
            {
              field: "hours_open",
              label: "Opening",
              type: "time",
              required: true,
              defaultValue: "18:00",
              containerClassName:
                "flex w-40 h-14  pr-1 border border-gray-200 rounded-md m-2",
            },
            {
              field: "hours_close",
              label: "Closing",
              type: "time",
              required: true,
              defaultValue: "02:00",
              containerClassName:
                "flex w-40 h-14 pr-1 border border-gray-200 rounded-md m-2",
            },
          ],
          [
            {
              fieldType: "title",
              defaultValue: "Social Media",
              className: "text-xl font-black pt-2 flex w-full p-2",
            },
            {
              field: "socials.instagram",
              label: "Instagram",
              placeholder: "Instagram",
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              field: "socials.website",
              label: "Website",
              placeholder: "Website",
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              field: "socials.tiktok",
              label: "TikTok",
              placeholder: "TikTok",
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              field: "socials.youtubeLink",
              label: "YouTube Link",
              placeholder: "Youtube",
              containerClassName:
                "flex w-full p-2 border border-gray-200 rounded-md m-2",
            },
            {
              fieldType: "title",
              defaultValue: "Media",
              className: "text-2xl font-black p-2 flex w-full",
            },
            {
              fieldType: "title",
              defaultValue: "Upload up to 3 images",
              className:
                "text-md text-gray-300 font-black pt-0 pl-2 flex w-full",
            },
            {
              fieldType: "imageArray",
              field: "images",
              limit: 3,
              defaultValue: [],
            },
          ],
        ]}
      />
    </div>
  );
}
