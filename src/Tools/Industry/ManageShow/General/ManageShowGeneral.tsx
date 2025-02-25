import React, { useEffect, useState } from "react";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../../Redux/API/PublicAPI";
import Img from "../../../../Components/Images/Img";
import { IMAGE_URL } from "../../../../Helpers/configConstants";
import FlyerBuilder from "../../../Venue/FlyerBuilder";
import Form from "../../../../Components/Inputs/Form";
import VenueShowNotes from "../../../Venue/VenueShowNotes";
// import ManageShowTickets from "../../../Venue/ManageShowTickets";
// import PayoutCalculator from "../../../Venue/PayoutCalculator/PayoutCalculator";
import { useUpdateShowDescriptionMutation } from "../../../../Redux/API/IndustryAPI";
import { useAppSelector } from "../../../../hooks";
import DealVisualizer from "../../../../Components/Collections/DealVisualizer";
import { useGetSoldTicketsQuery } from "../../../../Redux/API/VenueAPI";
import LoadingWrapper from "../../../../Components/Layout/LoadingWrapper";
import Button from "../../../../Components/Buttons/Button";
import { Link } from "react-router-dom";
import ShareFlyer from "../../../Venue/ShareFlyer/ShareFlyer";
import FlyerSharingStatus from "../../../../Components/FlyerSharingStatus";

interface IManageShowGeneralProps {
  showID: string;
  uid?: string;
  viewType: string;
}

export default function ManageShowGeneral(props: IManageShowGeneralProps) {
  // const form = useAppSelector(
  //   (state) => state.user.forms["editShowDescription"]
  // );
  const uid = useAppSelector((state) => state.user.data.uid);
  const [uploadOnInit, setUploadOnInit] = useState(false);
  const [tickets, setTickets] = useState([]);
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const [flyerBuilderActive, setFlyerBuilderActive] = useState(false);
  const venues = useGetAllVenuesQuery();
  // const venue = venues.data?.[show.venueID];
  const [updateDescription] = useUpdateShowDescriptionMutation();
  function forceDownload(blob: string, filename: string) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Current blob size limit is around 500MB for browsers
  function downloadResource(url: string, filename: string) {
    if (!filename) filename = url.split("\\").pop().split("/").pop();
    fetch(url, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch((e) => console.error(e));
  }

  const soldTickets = useGetSoldTicketsQuery(
    {
      showID: props.showID,
      venueID: show.venueID,
      SECRET_UID: props.uid || uid,
    },
    { skip: !show }
  );

  useEffect(() => {
    if (soldTickets.data) {
      if(soldTickets?.data?.soldTickets){
        setTickets(Object.values(soldTickets.data.soldTickets));
      }else{
        setTickets(Object.values(soldTickets.data));
      }
    }
  }, [soldTickets.data]);

  // const agreementItems = venue?.performanceAgreement?.agreement.map(
  //   (item: string, index: number) => <li key={index}>{item}</li>
  // );
  console.log(props.viewType);
  return (
    <LoadingWrapper queryResponse={[soldTickets]}>
      {show && (
        <>
          <>
            {props.viewType === "artist" && !flyerBuilderActive && (
              <div className="w-full flex flex-col justify-center items-center border rounded-md border-gray-200">
                <h1 className="font-black text-2xl text-center p-2">
                  Total Tickets Sold: {tickets.length}
                </h1>
              </div>
            )}
          </>
          <div
            className={
              flyerBuilderActive ? "p-2" : "grid grid-cols-4 md:grid-cols-8 p-2"
            }
          >
            {flyerBuilderActive ? (
              <>
                <Form
                  name="updateFlyer"
                  className="md:flex-row"
                  formMap={[
                    [
                      {
                        hidden: true,
                        prerequsite: false,
                      },
                    ],
                  ]}
                  noSubmit
                />
                <FlyerBuilder
                  className="w-full"
                  form="updateFlyer"
                  uploadOnInit={uploadOnInit}
                  standalone
                  showID={props.showID}
                  exitFn={() => {
                    setUploadOnInit(false);
                    setFlyerBuilderActive(false);
                  }}
                />
              </>
            ) : (
              <div className="col-span-4">
                <Img src={show.flyer} className="w-full" />
                <div className="flex flex-wrap gap-x-2">
                  <a
                    onClick={() =>
                      downloadResource(
                        IMAGE_URL + show.flyer,
                        show.name + " " + "Flyer"
                      )
                    }
                    className={`text-sm md:text-lg p-2 m-2 mx-auto flex items-center border-2 flex-1  hover:bg-gray-100 rounded-full justify-center`}
                  >
                    <i className="material-symbols-outlined">download</i>
                    Download
                  </a>
                  {(props.viewType === "venue" || show.cohosted) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFlyerBuilderActive(true);
                      }}
                      className={`text-sm mdtext-lg p-2 m-2 mx-auto flex flex-1 items-center border-2 whitespace-nowrap hover:bg-gray-100 rounded-full justify-center`}
                    >
                      <i className="material-symbols-outlined">build</i>Flyer
                      Builder
                    </button>
                  )}
                  {(props.viewType === "venue" || show.cohosted) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setUploadOnInit(true);
                        setFlyerBuilderActive(true);
                      }}
                      className={`text-sm md:text-lg p-2 m-2 mx-auto flex flex-1 items-center border-2  hover:bg-gray-100 rounded-full justify-center`}
                    >
                      <i className="material-symbols-outlined">upload</i>Upload
                    </button>
                  )}
                </div>
              </div>
            )}
            {!flyerBuilderActive && (
              <div className="col-span-4 p-2 pt-0">
                <DealVisualizer showID={props.showID} />
                <div className="w-full flex flex-col justify-center">
                  <div className="flex flex-col m-2 p-2 items-center border rounded-md border-gray-200">
                    <h1 className="text-2xl font-black text-center">
                      Show Details
                    </h1>
                    <h2 className="text-xl font-black text-center">
                      {show.name}
                    </h2>
                    <p className="text-center whitespace-pre-wrap">
                      {show.description}
                    </p>
                    <Link to={`/shows/${show._key}`} target="_blank">
                      <Button full>Show Page</Button>
                    </Link>
                  </div>
                  {
                    //re-enable in January
                    /* <div className="w-full flex flex-col justify-center items-center border rounded-md border-gray-200">
                  <h1 className="font-black text-2xl text-center p-2">Performance Agreement:</h1>
                  <div className="w-2/3">
                      {agreementItems}
                      </div>
                  </div> */
                  }
                  {props.viewType === "venue" && (
                    <>
                      <ShareFlyer showID={props.showID}/>
                      <div className="text-center w-full">
                      <FlyerSharingStatus showID={props.showID}/>
                      </div>
                      <VenueShowNotes
                        venueID={show.venueID}
                        showID={props.showID}
                      />
                    </>
                  )}
                  {show.cohosted && props.viewType === "artist" && (
                    <Form
                      name="editShowDescription"
                      className="flex flex-col"
                      doneLabel="Save Changes"
                      submitFn={updateDescription}
                      formMap={[
                        [
                          {
                            fieldType: "title",
                            defaultValue: "Edit Show Description",
                            className: "text-2xl font-black p-2 text-center",
                          },
                          {
                            fieldType: "hidden",
                            field: "showID",
                            defaultValue: show._key,
                          },
                          {
                            fieldType: "textarea",
                            field: "description",
                            label: "Show Description",
                            defaultValue: show.description || "",
                            containerClassName:
                              "flex w-full p-2 border border-gray-200 rounded-md m-2",
                            className: "",
                          },
                        ],
                      ]}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </LoadingWrapper>
  );
}
