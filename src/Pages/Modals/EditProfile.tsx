import React from "react";
import CategoryNavigator from "../../Components/Buttons/CategoryNavigator";
import { useAppSelector } from "../../hooks";
import EditAccountProfileForm from "../../Forms/EditProfile/EditAccountProfileForm";
import EditHostProfileForm from "../../Forms/EditProfile/EditHostProfileForm";
import EditArtistProfileForm from "../../Forms/EditProfile/EditArtistProfileForm";
import EditProfileShowrunnerForm from "../../Forms/EditProfile/EditProfileShowrunnerForm";
import CategoryTabs from "../../Components/Layout/CategoryTabs";

export default function EditProfile() {
  const view = useAppSelector((state) => state.ui.views.editProfile);
  //   const user = useAppSelector((state) => state.user.data);
  const currentCategory = view?.category;

  return (
    <div className="flex flex-col min-h-full flex-grow min-w-full items-center justify-center">
      {!view.category && (
        <h1 className="text-3xl text-center font-black mb-3">Edit Profile</h1>
      )}
      <CategoryTabs
          view="editProfile"
          tabs={[
            {
              label: "Account",
              category: "account",
            },
            {
              label: "Artist",
              category: "artist",
            },
            {
              label: "Venue",
              category: "host",
            },
            {
              label: "Showrunner",
              category: "showrunner",
            },
          ]}
        />
      <p className="text-center"></p>
      <div className="min-h-full flex min-w-full justify-center">
      {/* 
      PUBgenius: this is broken. Fix ASAP.
      <CategoryNavigator
          view="editProfile"
          optionMap={{
            account: {
              label: "Account",
              description: "General Settings",
            },
            artist: {
              label: "Artist",
              description: "Set up your Artist Profile",
            },
            host: {
              label: "Venue",
              description: "Manage your venue",
            },
            showrunner: {
              label: "Showrunner",
              description: "Manage shows for other venues",
            },
          }}
        /> */}
        
        {currentCategory === "account" && (
          <>
            <EditAccountProfileForm />
          </>
        )}
        {currentCategory === "host" && (
          <>
            <EditHostProfileForm />
          </>
        )}
        {currentCategory === "artist" && (
          <>
            <EditArtistProfileForm />
          </>
        )}
        {currentCategory === "showrunner" && (
          <>
            <EditProfileShowrunnerForm />
          </>
        )}
      </div>
    </div>
  );
}
