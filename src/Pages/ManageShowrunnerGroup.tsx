import React, { useEffect } from "react";
import {
  useGetAllShowrunnerGroupsQuery,
  // useGetAllShowsQuery,
  // useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import { useParams } from "react-router-dom";
import ShowCalendar from "../Tools/ShowCalendar";
import ManageShowsList from "../Tools/Venue/ManageShowsList";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import LabelButton from "../Components/Buttons/LabelButton";
import { openModal } from "../Redux/UI/UISlice";
import { FilterByShowTime } from "../Helpers/FilterFunctions/ShowFilterFunctions";
import { renderPageTitle } from "../Helpers/HelperFunctions";
import Button from "../Components/Buttons/Button";

export default function ManageShowrunner() {
  const { SGID } = useParams();
  const srGroups = useGetAllShowrunnerGroupsQuery();
  // const shows = useGetAllShowsQuery();
  const showrunner = srGroups.data?.[SGID!];

  useEffect(() => {
    if (showrunner) {
      renderPageTitle("Manage " + showrunner.name);
    }
  }, [showrunner]);

  return (
    <LoadingWrapper queryResponse={[srGroups]}>
      {showrunner && (
        <>
          <div>
            <h1 className="text-2xl font-black text-center">
              {showrunner.name}
            </h1>
            <div className="flex flex-row justify-center mt-2 gap-2">
              <Button
                className="text-xs text-white border bg-amber-400"
                action={openModal({
                  status: true,
                  component: "EditShowrunnerProfileForm",
                  data: { SRID: SGID },
                })}
              >
                Edit Showrunner
              </Button>
              <Button
                className="text-xs text-white border bg-red-400"
                action={openModal({
                  status: true,
                  component: "EditShowrunnerToolbox",
                  data: { SRID: SGID },
                })}
              >
                Showrunner Toolbox
              </Button>
              <Button
                inline
                className="text-xs text-white border bg-blue-400"
                link={"/profile/s/" + SGID}
              >
                Showrunner Page
              </Button>
            </div>
            <div className="flex justify-center m-2">
              <LabelButton
                className="text-sm text-gray-500 border border-gray-500"
                iconClassName="text-base"
                icon="add"
                action={openModal({
                  status: true,
                  component: "CreateShow",
                  data: { SRID: SGID },
                })}
              >
                New Show
              </LabelButton>
            </div>
          </div>
          <ShowCalendar
            showrunnerID={SGID}
            viewType="showrunner"
            filterFn={FilterByShowTime}
          />
          <ManageShowsList showrunnerID={SGID} />
        </>
      )}
    </LoadingWrapper>
  );
}
