import React, { useEffect, useState } from "react";
import { truncateNumber } from "../../../Helpers/HelperFunctions";
import {
  useCalculatePayoutsQuery,
  useGetSoldTicketsQuery,
} from "../../../Redux/API/VenueAPI";
import { useAppSelector } from "../../../hooks";
import { useGetAllShowsQuery } from "../../../Redux/API/PublicAPI";
import TargetPayoutCard from "../../../Components/Cards/TargetPayoutCard";
import { Type } from "../../../Helpers/shared/Models/Type";
import { useArtistCalculatePayoutsQuery } from "../../../Redux/API/ArtistAPI";
import { IPaymentObject } from "../../../Helpers/shared/Models/Payout";

interface IPayoutData {
  [name: string]: IPaymentObject;
}

function PayoutManager(props: { showID: string; viewType: Type }) {
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const payouts = useCalculatePayoutsQuery(
    { SECRET_UID: user.uid, venueID: show.venueID, showID: props.showID },
    { skip: !show || props.viewType === "artist" }
  );
  const artistPayouts = useArtistCalculatePayoutsQuery(
    { SECRET_UID: user.uid, showID: show._key },
    { skip: !show || props.viewType === "venue" }
  );
  const tickets = useGetSoldTicketsQuery(
    { SECRET_UID: user.uid, venueID: show.venueID, showID: props.showID },
    { skip: !show }
  );
  const ticketData = tickets?.data?.["soldTickets"] || {};
  const [ticketSales, setTicketSales] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(null);
  const [currentNumber, confirmCurrentNumber] = useState(false);
  const [allPaid, setAllPaid] = useState(false);
  const [payoutData, setPayoutData] = useState<IPayoutData>({});

  useEffect(() => {
    if (payouts?.data?.payouts || artistPayouts?.data?.payouts) {
      setPayoutData(payouts?.data?.payouts || artistPayouts?.data?.payouts);
    }
  }, [payouts?.fulfilledTimeStamp, artistPayouts.fulfilledTimeStamp]);

  const updatePayoutData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof tData;
    var tData: IPayoutData = { ...payoutData };
    if (!tData[name].paid) {
      tData[name] = { ...tData[name], total: e.target.value };
    } else {
      tData[name] = { ...tData[name], additionalPayment: e.target.value };
    }
    tData[name] = { ...tData[name], custom: true };
    setPayoutData(tData);
  };

  const calculateTicketSales = () => {
    // var ticketSales = 0;
    // var ticketKeys = ticketData ? Object.keys(ticketData) : [];
    // ticketKeys.forEach((ticketID) => {
    //   ticketSales =
    //     Number(ticketSales) + Number(ticketData?.[ticketID ]?.price || 0);
    // });
    const ticketSales = Object.entries(ticketData || {}).reduce(
      (acc, ticket) => acc + Number(ticket?.[1]?.price || 0),
      0
    );
    setTicketSales(ticketSales);
  };

  const checkPayoutCompletion = async () => {
    let tAllPaid = null;
    for await (const recipientID of Object.keys(payoutData)) {
      let recipient = payoutData[recipientID];
      if (recipient.paid && tAllPaid !== false) {
        tAllPaid = true;
      } else {
        tAllPaid = false;
      }
    }
    setAllPaid(tAllPaid);
  };

  const updateArtistSplit = async (difference: number) => {
    let unpaidArtists = [];
    let newPayouts: IPayoutData = {};
    let total = 0;
    let remainder = Number(total) - Number(difference);
    for await (const recipientID of Object.keys(payoutData)) {
      let recipient = payoutData[recipientID];
      if (
        (!recipient.paid || recipient.customAmount) &&
        !recipient.status &&
        recipient.type !== "venue" &&
        !recipient.custom
      ) {
        unpaidArtists.push(recipientID);
        newPayouts[recipientID] = { ...payoutData[recipientID] };
      } else {
        newPayouts[recipientID] = { ...payoutData[recipientID] };
        remainder = truncateNumber(
          Number(remainder || 0) -
            Number(payoutData[recipientID].total || 0) -
            Number(payoutData[recipientID].additionalPayment || 0)
        );
      }

      for await (const artistID of unpaidArtists) {
        console.log(difference + " is difference");
        let split = difference / unpaidArtists.length;
        console.log(split);
        if (0 < split && split < 0.01) {
          split = 0;
        }
        console.log(split + " is split");
        if (!payoutData[artistID].custom) {
          console.log("updating split");
          let newTotal = truncateNumber(
            Number(payoutData[artistID].total || 0) +
              Number(payoutData[artistID].additionalPayment || 0) +
              Number(split || 0)
          );
          if (newTotal < 0.01) {
            console.log("Changing new total");
            newTotal = 0;
          }
          remainder = truncateNumber(Number(remainder) - Number(newTotal));
          if (0 < remainder && remainder < 0.01) {
            remainder = Number(0);
          }
          newPayouts[artistID].total = Number(newTotal);
        }
      }
    }
    console.log("Remainder: " + remainder);
    if (!payoutData[show.venueID].paid) {
      newPayouts[show.venueID].total = Number(newPayouts[show.venueID].total);
    } else {
      newPayouts[show.venueID] = payoutData[show.venueID];
    }
    setPayoutData(newPayouts);
  };

  const confirmCurrentTimer = () =>
    setTimeout(async () => {
      confirmCurrentNumber(true);
    }, 50);

  useEffect(() => {
    confirmCurrentNumber(false);
    // clearTimeout(confirmCurrentTimer);
    confirmCurrentTimer();
    if (currentTotal && ticketSales) {
      let difference = truncateNumber(ticketSales - Number(currentTotal));
      if (difference) {
        updateArtistSplit(difference || 0);
      }
    }
  }, [currentTotal, ticketSales]);

  const numberTimeout = () => {
    setTimeout(() => {
      confirmCurrentNumber(true);
    }, 1000);
  };

  useEffect(() => {
    calculateTicketSales();
  }, [ticketData]);

  useEffect(() => {
    if (payoutData) {
      numberTimeout();
      let tempTotal = 0;
      Object.keys(payoutData).forEach((recipient) => {
        let payout = payoutData[recipient];
        tempTotal =
          Number(tempTotal) +
          Number(payout.total) +
          Number(payout.additionalPayment || 0);
      });
      setCurrentTotal(truncateNumber(tempTotal));
      checkPayoutCompletion();
    }
  }, [payoutData]);
  console.log(payoutData);
  return (
    <>
      <div className="flex flex-col md:flex-row w-full justify-evenly p-2 text-xl font-bold">
        {props.viewType === "venue" && (
          <p>Total ticket sales: ${String(ticketSales || 0)}</p>
        )}
        {props.viewType === "venue" &&
          new Date(show.starttime).getTime() < Date.now() && (
            <h2 className="centered sm-pad">
              {currentNumber && currentTotal > ticketSales
                ? "Your payment amount exceeds total ticket sales. Please adjust payout amounts to proceed."
                : "Total Payouts: " + currentTotal + "/" + ticketSales}
            </h2>
          )}

        <p>
          Total tickets sold:{" "}
          {String(
            Object.keys(tickets?.data?.["soldTickets"] || {})?.length || 0
          )}
        </p>
      </div>
      <div className="flex std-gap flex-wrap justify-center">
        {allPaid && currentTotal === ticketSales && (
          <div className="flex-col items-center p-4">
            <h1 className="centered text-2xl font-black">
              All artists have been paid!
            </h1>
            <h2 className="centered">No further action is necessary.</h2>
          </div>
        )}
        <div className="flex gap-2 justify-center w-full p-2 overflow-auto flex-wrap">
          {new Date(show.starttime).getTime() < Date.now() ? (
            Object.keys(payoutData).map((recipient) => {
              let id = recipient;
              const recipientObject = payoutData[recipient];
              return (
                <TargetPayoutCard
                  id={id}
                  disabled={allPaid && currentTotal === ticketSales}
                  showID={props.showID}
                  paymentObject={recipientObject}
                  overpaid={ticketSales < currentTotal}
                  remainder={ticketSales - currentTotal}
                  onChange={updatePayoutData}
                  viewType={props.viewType}
                />
              );
              // payouts_enabled={recipient.payouts_enabled}
              //  type={recipient.type}  venueID={show.venueID} paid={recipient.paid}  defaultAmount={recipient.total}
            })
          ) : (
            <>
              <h1>Once this show ends, you will be able to pay out artists.</h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default PayoutManager;
