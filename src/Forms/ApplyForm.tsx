import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import dayjs from "dayjs";
import Form, { FormMapProps } from "../Components/Inputs/Form";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import { useArtistApplyMutation } from "../Redux/API/ArtistAPI";
import { useAppDispatch } from "../hooks";
import { resetSidebar } from "../Redux/UI/UISlice";
import DealVisualizer from "../Components/Collections/DealVisualizer";
import ShowEmblem from "../Components/Images/ShowEmblem";
// import FormInput from "../Components/Inputs/FormInput";
import { useShowTimes } from "../Hooks/useShowTimes";

export default function ApplyForm(props: { showID: string }) {
  const dispatch = useAppDispatch();
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  const show = shows.data?.[props.showID];
  const venue = venues.data?.[show?.venueID];
  const [sendApplication] = useArtistApplyMutation();
  const [performanceAgreementForm, setPerformanceAgreementForm] = useState([]);
  const containerRef = useRef(null);
  // const [contactNumber, setContactNumber] = useState();
  const [lineCount, setLineCount] = useState(1);
  const [limit, setLimit] = useState(5);
  // const [showStartTime] = useState(dayjs(show?.starttime).format("MMMM DD, YYYY h:mmA"));
  const { showDate, showStartTime } = useShowTimes(show);
  const weekday = dayjs(show?.starttime).format("dddd");

  const lines = show.description
    ? splitTextIntoLines(show.description, 25)
    : [];

  useEffect(() => {
    const performanceAgreement = venue?.performanceAgreement?.agreement || [];

    let performanceAgreementForm: FormMapProps[] = [];
    performanceAgreement.forEach((agreementItem: string, i: number) => {
      performanceAgreementForm.push({
        fieldType: "toggleSlider",
        placeholder: `${agreementItem}`,
        required: true,
        containerClassName: "flex w-full mb-2",
        className: "",
        field: `performanceAgreement.${i}`,
      });
    });
    setPerformanceAgreementForm(performanceAgreementForm);
  }, [venue]);

  useLayoutEffect(() => {
    if (show.description) {
      // Calculate the number of lines based on the container height when the component mounts
      const calculateLines = () => {
        const lineHeight = parseInt(
          getComputedStyle(containerRef.current).lineHeight,
        );
        const containerHeight = containerRef.current.scrollHeight;
        const lines = Math.round(containerHeight / lineHeight);
        setLineCount(lines);
      };

      // Update the line count when the component mounts
      calculateLines();

      // Cleanup: Remove event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", calculateLines);
      };
    }
  }, [show.description]);

  const handleShowMore = () => {
    setLimit(lines.length);
  };

  const handleShowLess = () => {
    setLimit(5);
  };

  function splitTextIntoLines(text: string, lineLength: number) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + word).length <= lineLength) {
        currentLine += (currentLine === "" ? "" : " ") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine !== "") {
      lines.push(currentLine);
    }

    return lines;
  }

  console.log(venue);

  return (
    <div className="mt-10">
      <DealVisualizer showID={props.showID} />
      <div className="flex flex-col items-center mx-2">
        <div className="max-w-[128px] flex-none m-4">
          <ShowEmblem venueEmblem={venue?.avatar} />
        </div>
        <h1 className="font-black text-2xl text-center">{show?.name}</h1>
        <p className="text-md font-black text-center mb-2">
          {weekday + " | " + showDate + " | " + showStartTime}
        </p>
        <div className=" border border-gray-200 rounded-md p-2 mb-2 w-full">
          <h2 className="font-black text-lg text-center">Show Details</h2>
          <div ref={containerRef} style={{ overflowY: "auto" }}>
            {show?.description && (
              <>
                {lines.slice(0, limit).map((line, index) => (
                  <p key={index} className="text-md text-center">
                    {line}
                  </p>
                ))}
                {lines.length > limit && (
                  <>
                    <button
                      className="p-3 hover:bg-gray-100 w-full text-blue-400"
                      onClick={handleShowMore}
                    >
                      Show More
                    </button>
                  </>
                )}
                {/* Show the "Show Less" button if fully expanded */}
                {limit !== 5 && (
                  <button
                    className="p-3 hover:bg-gray-100 w-full text-red-400"
                    onClick={handleShowLess}
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Form
        name="apply"
        className="p-4 pt-0"
        fixedNav
        successStatusMessage="Application submitted. Good luck!"
        doneLabel="Apply"
        completedLabel="Applied!"
        submitFn={sendApplication}
        onComplete={() => dispatch(resetSidebar())}
        clearOnComplete={true}
        formMap={[
          [
            {
              type: "hidden",
              field: "showID",
              value: props.showID,
              defaultValue: props.showID,
            },
            {
              type: "hidden",
              field: "venueID",
              value: venue?._key,
              defaultValue: venue?._key,
            },
            {
              fieldType: "title",
              prerequisite: venue.hasTextContactEnabled || false,
              defaultValue: "Contact",
              className: "text-2xl font-black flex-col mb-3",
            },
            {
              fieldType: "title",
              prerequisite: venue.hasTextContactEnabled || false,
              defaultValue: `If selected, ${venue.name} will reach out to you via phone with a text to confirm the booking. Please enter your phone number below:`,
              className: "text-md flex-col mb-3",
            },
            {
              field: "phone",
              prerequisite: venue.hasTextContactEnabled || false,
              required: venue.hasTextContactEnabled,
              placeholder: "Phone Number",
              label: "Phone Number",
              type: "tel",
              containerClassName:
                "flex w-50 h-14 pr-1 border border-gray-200 rounded-md m-2",
            },
            {
              fieldType: "title",
              defaultValue: "Review & Confirm",
              className: "text-2xl font-black flex-col mb-3",
            },
            ...performanceAgreementForm,
            {
              fieldType: "title",
              prerequisite: venue.customBackline || false,
              className: "w-full flex-col text-2xl font-black",
              defaultValue: "Backline Specs",
            },
            {
              fieldType: "title",
              className: "text-xs text-gray-400 w-full mb-2",
              prerequisite: venue.customBackline || false,
              defaultValue:
                "Please review the venue's backline information and confirm it is compatible with your set below before proceeding.",
            },
            {
              fieldType: "title",
              className: "whitespace-pre",
              prerequisite: venue.customBackline || false,
              defaultValue: venue.customBackline,
            },
            {
              fieldType: "toggleSlider",
              prerequisite: venue.customBackline || false,
              placeholder: `I have read the venue's backline specs, and confirm they work with my set.`,
              required: true,
              containerClassName: "flex w-full mt-4 font-black",
              className: "",
              field: `performanceAgreement.backline`,
            },
          ],
        ]}
      />
    </div>
  );
}
