import React, { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { useGetAllShowrunnerGroupsQuery } from "../Redux/API/PublicAPI";
import Button from "../Components/Buttons/Button";
import { openModal } from "../Redux/UI/UISlice";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import ManageShowrunnerCard from "../Components/Cards/ManageShowrunnerCard";
import { renderPageTitle } from "../Helpers/HelperFunctions";

export default function ManageShowrunners() {
  const userSRG = useAppSelector((state) => state.user.data.sr_groups);
  const srGroups = useGetAllShowrunnerGroupsQuery();
  const srGroupsArray = Object.keys(userSRG);

  useEffect(() => {
    renderPageTitle("Showrunner Dashboard");
  }, []);

  return (
    <div className="flex min-w-full h-full min-h-full max-h-full justify-center flex-col flex-grow">
      <LoadingWrapper queryResponse={[srGroups]}>
        <div className="max-w-[580px] flex flex-col mx-auto justify-center mb-12 text-center">
          <div>
            Welcome! As a Showrunner, you can book, promote, and ticket your
            shows directly from your showrunner dashboard.
          </div>
          <br />
          <div>
            Create your showrunner group(s) below to manage your roster, shows,
            and more! (Here's a real group for reference:{" "}
            "<a className="underline text-blue-500" href="https://tunehatch.com/profile/g/15334572" target="_blank">
              Studio Rats
            </a>"
            . Check them out!)
          </div>
        </div>
        <div className="flex justify-center mb-2">
          <h1 className="text-5xl font-black text-center">Your Groups</h1>
        </div>
        <div className="flex justify-center">
          <Button
            inline
            className="bg-amber-500 text-white"
            action={openModal({
              status: true,
              component: "CreateSRG",
              data: {},
            })}
          >
            New Group
          </Button>
        </div>

        <div className="flex overflow-auto w-full flex-fix gap-4 pl-8 my-8">
          {srGroupsArray.map((SRID) => {
            return <ManageShowrunnerCard id={SRID} key={SRID} />;
          })}
        </div>
      </LoadingWrapper>
    </div>
  );
}
