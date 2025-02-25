import React from "react";
import Form from "../Components/Inputs/Form";
import {
  useClaimProfileMutation,
  useFetchClaimedProfileQuery,
  useRegisterMutation,
} from "../Redux/API/PublicAPI";
import { useAppSelector } from "../hooks";
// import { openModal } from "../Redux/UI/UISlice";
import { Navigate, useParams } from "react-router-dom";

export default function RegistrationForm() {
  const { claimCode } = useParams();
  // const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  const user = useAppSelector((state) => state.user.data);
  const claim = useFetchClaimedProfileQuery(
    { claimCode },
    { skip: !claimCode }
  );
  const [claimProfile] = useClaimProfileMutation();
  const profileData = claim.data;
  return !user?.uid ? (
    <>
      {profileData && (
        <div className="m-5 p-2 bg-orange rounded">
          <h1 className="text-2xl text-center font-black text-white">
            You were registered by a venue!
          </h1>
          <p className="text-center text-white">
            You are already confirmed for one or more shows with a venue on
            TuneHatch. We have prefilled any information the venue has given us
            on your behalf.
            <br />
            {profileData?.type?.artist?.stagename && (
              <b>
                Your stagename, {profileData.type.artist.stagename}, has already
                been added to your account.
              </b>
            )}
          </p>
        </div>
      )}
      <Form
        name="registrationForm"
        className="grid grid-cols-4 w-full gap-y-2 p-4 gap-2"
        fixedNav
        // onComplete={() => dispatch(openModal({status: true, component: "Welcome"}))}
        submitFn={!profileData ? register : claimProfile}
        formMap={[
          [
            {
              fieldType: "title",
              className: "col-span-4 pl-4",
              defaultValue: (
                <>
                  <h2 className="text-2xl font-black">About You</h2>
                  <p>
                    Please enter your own information. You'll have the chance to
                    add a stagename or venue name when you are registered.
                  </p>
                </>
              ),
            },
            {
              field: "claimCode",
              fieldType: "hidden",
              defaultValue: profileData?.claimCode || null,
            },
            {
              label: "Artist",
              field: "type.artist.enabled",
              fieldType: "buttonToggle",
              containerClassName: "col-span-2",
              defaultValue: profileData?.type?.artist?.enabled,
            },
            {
              label: "Venue",
              field: "type.host.enabled",
              fieldType: "buttonToggle",
              containerClassName: "col-span-2",
              defaultValue: profileData?.type?.host?.enabled,
            },
            {
              label: "Showrunner",
              field: "type.showrunner.enabled",
              fieldType: "buttonToggle",
              containerClassName: "col-span-2",
              defaultValue: profileData?.type?.showrunner?.enabled,
            },
            {
              field: "firstname",
              placeholder: "First Name",
              defaultValue: profileData?.firstname || "",
              large: true,
              required: true,
              containerClassName: "col-span-2",
            },
            {
              field: "lastname",
              placeholder: "Last Name",
              defaultValue: profileData?.lastname || "",
              large: true,
              required: true,
              containerClassName: "col-span-2",
            },
            {
              field: "email",
              type: "email",
              placeholder: "Email Address",
              defaultValue: profileData?.email || "",
              containerClassName: "col-span-4",
              required: true,
            },
            {
              field: "password",
              type: "password",
              placeholder: "Password",
              classes: "w-full",
              containerClassName: "col-span-2",
              required: true,
            },
            {
              field: "confirmPassword",
              placeholder: "Confirm Password",
              classes: "w-full",
              type: "password",
              containerClassName: "col-span-2",
              mustMatch: "password",
              required: true,
            },
          ],
        ]}
      />
    </>
  ) : (
    <Navigate to={user.showrunner ? "/showrunner-tools" : "/profile"} />
  );
}
