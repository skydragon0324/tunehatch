import React, { useEffect } from "react";
import CreateShowForm from "../../Forms/CreateShow/CreateShowForm";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { resetView } from "../../Redux/UI/UISlice";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { PUBLIC_URL, PUBLIC_URL_NOPORT } from "../../Helpers/configConstants";
import ShareFlyer from "../../Tools/Venue/ShareFlyer/ShareFlyer";

export default function CreateShow(props: {
  venueID?: string;
  showrunnerID?: string;
  defaultDate?: Date | string;
}) {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.ui.views.createShow.view);
  const viewData = useAppSelector((state) => state.ui.views.createShow.data);

  useEffect(() => {
    return () => {
      dispatch(resetView("createShow"));
    };
  }, []);

  return (
    <>
      {currentView === 0 && (
        <>
          <CreateShowForm
            venueID={props.venueID}
            showrunnerID={props.showrunnerID}
            defaultDate={props.defaultDate}
          />
        </>
      )}
      {currentView === 1 && (
        <>
          <h1 className="text-center text-2xl font-black">Posting your show...</h1>
          <p className="text-center">This should only take a second.</p>
          <div className="flex items-center justify-center w-full">
            <LoadingSpinner />
          </div>
        </>
      )}
      {currentView === 2 && (
        <>
          <h1 className="text-center text-2xl font-black">Show created!</h1>
          <h1 className="text-center text-sm text-gray-300">Here are a few tips to help make sure your show is a hit:</h1>
          <p className="text-center text-xl font-black">Share your show link</p>
          <p className="text-center">
            Your show link is a hub for everything people need to know about your show: fans can see the
            lineup, check out the venue, and purchase tickets.
          </p>
          <div className="flex justify-center w-full">
          <textarea value={`${PUBLIC_URL_NOPORT}/shows/${viewData.showID}`} className="w-4/5 border rounded mx-auto border-orange"/>
          </div>
          <h2 className="mt-3 text-center text-xl font-black">Share to social media</h2>
          <p className="text-center">
            TuneHatch allows you to share to your connected business Instagram
            and Facebook pages in a single click. You can share the flyer right
            now, or schedule it for any time in the future.
          </p>
          <ShareFlyer showID={viewData.showID}/>
        </>
      )}
    </>
  );
}