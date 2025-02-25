import React from "react";
// import CountLabel from "../../../Components/Labels/CountLabel";
// import ArtistCard from "../../../Components/Cards/ArtistCard/ArtistCard";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
} from "../../../Redux/API/PublicAPI";
import { useToggleLineupLockMutation } from "../../../Redux/API/IndustryAPI";
import { useAppSelector } from "../../../hooks";
import LineupRow from "./LineupRow";
import Img from "../../../Components/Images/Img";
import Card from "../../../Components/Layout/Card";
import Button from "../../../Components/Buttons/Button";
import { openSidebar } from "../../../Redux/UI/UISlice";
import QuestionLabel from "../../../Components/Labels/QuestionLabel";

interface ILineupBuilderProps {
  showID?: string;
}

export default function LineupBuilder({ showID }: ILineupBuilderProps) {
  const SECRET_UID = useAppSelector((state) => state.user.data.uid);
  const shows = useGetAllShowsQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const show = shows.data?.[showID];
  const showrunner =
    showrunners.data?.[show.showrunner?.[0]?.id || show.showrunner?.[0]?.uid] ||
    null;
  const [toggleLineupLock] = useToggleLineupLockMutation();
  return show ? (
    <div>
      <h2 className="text-lg font-black">Show Lineup</h2>
      <div className="flex items-center mb-2 mt-2">
        <button
          onClick={() =>
            toggleLineupLock({
              SECRET_UID,
              venueID: show.venueID,
              showID: showID,
              status: !show.lineup_locked,
            })
          }
        >
          <i
            className={`material-symbols-outlined p-4 pl-6 ${
              show.lineup_locked ? "text-red-500" : "text-green-500"
            }`}
          >
            {show.lineup_locked ? "lock" : "lock_open"}
          </i>
        </button>
        <p className="text-xs p-2">
          Your lineup is currently{" "}
          <span className="font-bold">
            {show.lineup_locked ? "locked" : "unlocked"}
          </span>
          . This means you can add and invite artists to your show, and artists
          are able to send applications from the Apply page. Tap the lock icon
          to change this at any time.
        </p>
      </div>
      {showrunner ? (
        <div className="mb-2">
          <QuestionLabel
            className="mb-1"
            question="What is a Showrunner?"
            label={
              <span className="pr-1 text-base text-gray-500">Showrunner</span>
            }
          >
            <p className="text-center">
              A Showrunner is a group that helps you manage your show. This can
              be a promoter, booker, or anyone else who wants to help make sure
              your show is a success! <br />
              <br /> When you add a Showrunner to your show on TuneHatch, they
              will have the ability to manage the show as if they were the ones
              running it.
            </p>
          </QuestionLabel>
          <Card>
            <div className="flex">
              <div className="flex-shrink-0 p-2 flex items-center">
                <Img
                  src={showrunner.avatar}
                  className="w-24 h-24 rounded-full border border-violet-400"
                />
              </div>
              <div className="p-2 flex-col items-center">
                <h2 className="font-black text-xl">{showrunner.name}</h2>
                <p className="pl-1 text-xs text-gray-400">
                  {showrunner.members.length} members |{" "}
                  {showrunner.venues.length} venues
                </p>
                <p className="p-1 truncate-2">
                  {showrunner.about ||
                    "A promoter group that helps you put on your best shows. We do lots of stuff."}
                </p>
              </div>
            </div>
            <div className="flex flex-grow">
              <Button
                inline
                full
                className="text-red-500 border-r border-t rounded-none"
              >
                Remove
              </Button>
              <Button
                inline
                full
                className="text-blue-500 border-t rounded-none"
                action={openSidebar({
                  status: true,
                  component: "ViewProfile",
                  data: { profileID: showrunner.SRID, type: "showrunner" },
                })}
              >
                About
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <></>
      )}
      {/* Confirmed Artists */}
      <LineupRow category="performers" showID={showID} />
      {/* Invites */}
      <LineupRow category="invites" showID={showID} />
      {/* Applications */}
      <LineupRow category="applications" showID={showID} />
    </div>
  ) : (
    <></>
  );
}
