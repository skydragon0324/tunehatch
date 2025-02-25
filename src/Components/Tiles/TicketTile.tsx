import QRCodeStyling, { Options } from "qr-code-styling-node";
import React, { useEffect, useState } from "react";
import { generateQROptions } from "../../Helpers/shared/qrOptions";
import { APIURL, PUBLIC_URL } from "../../Helpers/configConstants";
import axios from "axios";
import dayjs from "dayjs";
import { useAppSelector } from "../../hooks";
import Img from "../Images/Img";

export default function TicketTile(props: {
  venueID: string;
  showID: string;
  ticketIDs: string[];
  tickets?: { image?: string }[];
}) {
  const SECRET_UID = useAppSelector((state) => state.user?.data?.uid);
  const [qrSrcs, setQrSrcs] = useState([]);
  const [redeemed, setRedeem] = useState("");
  const [redeemScreen, toggleRedeemScreen] = useState(false);

  const generateQRCode = async () => {
    const qrSources = await Promise.all(
      props.ticketIDs?.map(async (ticketID) => {
        let config: Partial<any> = {
          ...generateQROptions(),
          data:
            PUBLIC_URL +
            "/e/ts/" +
            props?.venueID +
            "/" +
            props?.showID +
            "/" +
            ticketID,
        };
        let qrCodeImage = new QRCodeStyling(config);
        let qrdata: Blob | Buffer = await qrCodeImage?.getRawData("svg");
        return URL.createObjectURL(qrdata as Blob);
      })
    );
    setQrSrcs(qrSources);
  };
  const redeemTicket = async (ticketID: string) => {
    const ticket = await axios.post(APIURL + "self-verify-ticket", {
      ticketID,
      uid: SECRET_UID || 0,
      showID: props?.showID,
    });

    let timestamp = dayjs(ticket?.data?.redeemed);
    let date = {
      date: timestamp?.format("MMMM DD"),
      time: timestamp?.format("hh:mm A"),
    };
    setRedeem(date?.date + " at " + date?.time);
    setTimeout(() => {
      toggleRedeemScreen(false);
    }, 5000);
  };

  const openRedeemScreen = () => {
    toggleRedeemScreen(true);
    if (redeemed) {
      setTimeout(() => {
        toggleRedeemScreen(false);
      }, 5000);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <>
      {qrSrcs.map((qrSrc, index) => (
        <div className="flex flex-col justify-center p-4 w-80 h-80 mx-auto items-center bg-gray-50 border-gray-50 rounded-md mb-4 mt-2">
          {redeemScreen ? (
            <>
              {redeemed ? (
                <>
                  <>
                    <h2 className="text-2xl font-black mb-2 mt-2">
                      Ticket Redeemed
                    </h2>
                    <p className="text-center">
                      Ticket redeemed on <b>{redeemed}</b>
                    </p>
                  </>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-center text-xl">
                    Fans should not redeem their own tickets.
                  </h2>
                  <p className="text-center">
                    This process is irreversible, and should only be performed
                    by a doorperson when your ticket is ready to be redeemed.
                  </p>
                  <button
                    className="mt-5 p-4 bg-orange text-white rounded w-full"
                    onClick={() => redeemTicket(props.ticketIDs?.[index])}
                  >
                    Redeem
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <p className="mt-2 text-center">
                  Ticket #: {props.ticketIDs?.[index]}
                </p>
                {props.tickets && props.tickets[index]?.image ? (
                  <Img
                    src={props.tickets[index]?.image}
                    alt={`Ticket Image ${index + 1}`}
                    className="w-full"
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="mb-2">
                <img
                  alt=""
                  key={index}
                  src={qrSrc}
                  onClick={() => openRedeemScreen()}
                  className="w-full mb-2"
                />
              </div>
              <p className="text-center">Tap to Redeem</p>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
