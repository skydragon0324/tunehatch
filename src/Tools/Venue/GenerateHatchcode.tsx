import React, { useEffect, useRef, useState } from "react";
import Chick from "../../Images/ChickLogo.png";
import QRCodeStyling from "qr-code-styling-node";
import html2canvas from "html2canvas";
import { PUBLIC_URL } from "../../Helpers/configConstants";
import { generateQROptions } from "../../Helpers/shared/qrOptions";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import PoweredByTuneHatch from "../../Components/Labels/PoweredByTuneHatch";

export default function GenerateHatchcode(props: {
  venueID?: string;
  SRID?: string;
}) {
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[props.venueID];

  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners.data?.[props.SRID];

  const qrCanvas = useRef();
  const [qrSrc, setQrSrc] = useState(null);
  const printCanvas = useRef();
  const options: Partial<any> = {
    ...generateQROptions(),
    width: 280,
    height: 280,
    data:
      props.venueID != null
        ? `${PUBLIC_URL}/mv/${props.venueID}`
        : `${PUBLIC_URL}/msr/${props.SRID}`,
    image: Chick,
  };
  const qrCodeImage = new QRCodeStyling(options);

  const download = async () => {
    const element = printCanvas.current;
    const canvas = await html2canvas(element, {
      scale: 10,
      useCORS: true,
      onclone: (cloneDoc) => {
        const style = cloneDoc.createElement("style");
        style.innerHTML =
          "h1{position: relative; top: 1.5rem;} h3{position: relative; top: 1rem;} img{object-fit: cover;} .text-xs{font-size: .5rem; line-height: .5rem; margin-bottom: .5rem;}";
        cloneDoc.body.appendChild(style);
        console.log(cloneDoc);
      },
    });
    const data = canvas.toDataURL("show/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "show.png";

      document.body.appendChild(link);
      link.click();
    } else {
      window.open(data);
    }
  };

  const generateQRCode = async () => {
    let qrdata: any = await qrCodeImage.getRawData("svg");
    let qrObject = URL.createObjectURL(qrdata);
    setQrSrc(qrObject);
  };

  useEffect(() => {
    generateQRCode();
  }, [qrCanvas.current, props.venueID, props.SRID]);

  return venue || showrunner ? (
    <>
      <div className="w-full flex flex-wrap md:flex-nowrap justify-center">
        <div className="flex flex-shrink">
          <div
            className="flex-col w-full md:w-1/2 flex items-center"
            style={{ maxWidth: "300px", minWidth: "300px" }}
          >
            <div
              className="flex-col flex-fix"
              style={{ maxWidth: "300px", minWidth: "300px" }}
            >
              <div ref={printCanvas} className="p-4 flex-fix">
                <h1 className="text-center text-2xl font-black">
                  Welcome to {venue?.name || showrunner?.name}
                </h1>
                <h3 className="text-xl font-black text-center">
                  Scan to pay
                  <br />
                  No cash? No problem.
                </h3>
                <div className="relative">
                  <div className="absolute w-full top-1/2">
                    <img
                      className="w-18 h-14 relative mx-auto -mt-7"
                      src={Chick}
                    />
                  </div>
                  <img src={qrSrc} />
                </div>
                <PoweredByTuneHatch />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                download();
              }}
              className={`text-center justify-center text-lg p-2 m-2 flex items-center filter hover:brightness-110 bg-orange text-white rounded-full `}
            >
              <i className="material-symbols-outlined">download</i>Download
            </button>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col flex-1 w-full md:w-1/2 text-center p-4 md:justify-center">
            <h1 className="text-center text-2xl font-black">How It Works</h1>
            <p>
              Download and print your {venue != null ? "Venue" : "Showrunner"}'s
              HatchCode.
            </p>
            <br />
            <p>
              When a customer scans your HatchCode, they will be taken to a page
              that dynamically changes based on what's happening in your space:
              in real time.
            </p>
            <br />
            <p>
              If a ticketed show is currently running, they will immediately be
              able to purchase door tickets for the event.
            </p>
            <br />
            <p>
              If no show is running, they will be able to see your upcoming
              shows, {venue != null ? "venue" : "showrunner"} details, and more.
            </p>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
