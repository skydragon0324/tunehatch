import React from "react";
import Form from "../../Components/Inputs/Form";
import BannerAvatarUpload from "../../Components/Inputs/InputTypes/BannerAvatarUpload";
import { useGetAllVenuesQuery } from "../../Redux/API/PublicAPI";
import { useEditVenueMutation } from "../../Redux/API/VenueAPI";

export default function EditVenueProfile(props: { venueID: string }) {
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[props.venueID];
  const [editVenue] = useEditVenueMutation();

  return (
    venue && (
      <div className="flex flex-col w-full">
        <div className="relative w-full flex-grow">
          <BannerAvatarUpload
            form="editVenueProfile"
            bannerField={"banner"}
            avatar={venue.avatar}
            banner={venue.banner}
          />
        </div>
        <Form
          name="editVenueProfile"
          className="flex flex-wrap w-full p-2"
          additionalAuthParams={{ venueID: props.venueID }}
          submitFn={editVenue}
          doneLabel="Save"
          keepOnDismount
          media
          fixedNav
          formMap={[
            [
              {
                fieldType: "title",
                className: "text-2xl font-black",
                defaultValue: "General Settings",
              },
              {
                field: "name",
                fieldType: "text",
                containerClassName: "w-full flex-grow",
                placeholder: "Venue Name",
                large: true,
                defaultValue: venue.name,
              },
              {
                field: "about",
                fieldType: "textarea",
                containerClassName: "w-full",
                placeholder: "About",
                defaultValue: venue.about,
              },
              {
                field: "capacity",
                fieldType: "number",
                placeholder: "Capacity",
                containerClassName: "flex w-1/2 pr-1",
                defaultValue: venue.capacity,
              },
              {
                field: "min_age",
                fieldType: "number",
                placeholder: "Age Requirement",
                containerClassName: "flex w-1/2 pl-1",
                defaultValue: venue.min_age,
              },
              {
                field: "phone",
                placeholder: "Phone Number",
                label: "Phone Number",
                type: "tel",
                defaultValue: venue.contact?.phone || venue.phone,
                required: true,
                containerClassName:
                  "flex <w-1/2></w-1/2> h-14 pr-1 border border-gray-200 rounded-md m-2",
              },
              {
                field: "email",
                placeholder: "Email",
                label: "Contact Email",
                type: "email",
                defaultValue: venue?.contact?.email || venue?.email,
                required: true,
                containerClassName:
                  "flex w-1/2 h-14  pr-1 border border-gray-200 rounded-md m-2",
              },
              {
                fieldType: "title",
                defaultValue: "Location",
                className: "w-full",
              },
              {
                fieldType: "title",
                className: "",
                defaultValue: (
                  <>
                    {venue.location?.address} <br /> {venue.location?.city},{" "}
                    {venue.location?.state} {venue.location?.zip}
                  </>
                ),
                //  defaultValue: venue.location?.address ? (
                //   <>
                //     {venue.location?.address} <br />
                //     {venue.location?.city}, {venue.location?.state} {venue.location?.zip}
                //   </>
                // ) : (
                //   venue?.address
                // ),
              },
              {
                field: "location.address",
                metaField: "locationData",
                fieldType: "place",
                containerClassName: "w-full",
                className: "w-full",
                locationTypes: [],
                defaultValue: venue.location?.address || venue.address,
                clickToEnable: venue.location?.address || venue.address,
                label: "Update Address",
                icon: "settings",
              },
              {
                fieldType: "title",
                defaultValue: "Media",
                className: "text-2xl font-black p-2 flex w-full",
              },
              {
                fieldType: "imageArray",
                field: "images",
                limit: 3,
                defaultValue: venue.images || [],
              },
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
                defaultValue: venue.socials?.instagram || "",
              },
              {
                field: "socials.youtubeLink",
                label: "YouTube Link",
                placeholder: "Youtube",
                containerClassName:
                  "flex w-full p-2 border border-gray-200 rounded-md m-2",
                defaultValue: venue.socials?.youtubeLink || "",
              },
              {
                field: "socials.website",
                label: "Website",
                placeholder: "Website",
                containerClassName:
                  "flex w-full p-2 border border-gray-200 rounded-md m-2",
                defaultValue: venue.socials?.website || "",
              },
              {
                field: "socials.tiktok",
                label: "TikTok",
                placeholder: "TikTok",
                containerClassName:
                  "flex w-full p-2 border border-gray-200 rounded-md m-2",
                defaultValue: venue.socials?.tiktok || "",
              },
            ],
          ]}
        />
      </div>
    )
  );
}
