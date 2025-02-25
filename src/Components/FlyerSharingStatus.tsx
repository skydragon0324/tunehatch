import React from "react";
import { useGetAllShowsQuery } from "../Redux/API/PublicAPI";
import { ShowShareStatus } from "../Helpers/shared/Models/Show";
import dayjs from "dayjs";

export default function FlyerSharingStatus(props: { showID: string }) {
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const shareStatus: ShowShareStatus = show.shareStatus || {
    shareKey: "0",
    facebook: false,
    instagram: false,
  };
  const determineShareOutput = (status: boolean | string | Date) => {
    const sharedSnippet = (
      <span>
        <i className="material-symbols-outlined text-green-500">check_circle</i>
      </span>
    );
    const notSharedSnippet = (
      <span>
        <i className="material-symbols-outlined text-red-600">cancel</i>
      </span>
    );
    if (typeof status !== "boolean") {
      if (new Date(status).getTime() < Date.now()) {
        return sharedSnippet;
      } else {
        return <span>
          <i className="material-symbols-outlined">schedule</i>
          {dayjs(status).format("MM/DD/YYYY [at] h:mm A")}
          </span>;
      }
    } else {
      if (status === true) {
        return sharedSnippet;
      }else if(status === false)
      return notSharedSnippet;
    }
  };
  return show ? (
    <>
      <p className="flex w-full text-center justify-center font-bold">Flyer Sharing Status</p>
      <p className="flex w-full text-center justify-center">
        Facebook: {determineShareOutput(shareStatus.facebook)}
      </p>
      <p className="flex w-full text-center justify-center">
        Instagram: {determineShareOutput(shareStatus.facebook)}
      </p>
    </>
  ) : (
    <></>
  );
}
