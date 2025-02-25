import React, { useEffect, useState } from "react";
import Card from "../../Layout/Card";
import Img from "../../Images/Img";
import Button from "../../Buttons/Button";
import { Type } from "../../../Helpers/shared/Models/Type";
import { getDisplayName } from "../../../Helpers/HelperFunctions";
import PayoutButton from "./PayoutButton";
import {
  useSendPaymentMutation,
  useSendStripeReminderMutation,
} from "../../../Redux/API/VenueAPI";
import { useGetAllShowsQuery } from "../../../Redux/API/PublicAPI";
import { useAppSelector } from "../../../hooks";
import { IPaymentObject } from "../../../Helpers/shared/Models/Payout";

export default function PayoutCardDisplay(props: {
  target: {
    _key?: string;
    avatar?: string;
    name: string;
    type: Type;
  };
  viewType: string;
  showID: string;
  paymentObject: IPaymentObject;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  overpaid: boolean;
  remainder: number;
}) {
  console.log(props.paymentObject);
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const [custom, setCustom] = useState(false);
  const [open, setOpen] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [sendPayment] = useSendPaymentMutation();
  const [sendStripeReminder] = useSendStripeReminderMutation();

  const handleSendStripeReminder = async () => {
    sendStripeReminder({
      id: props.paymentObject?.["id"],
      SECRET_UID: user.uid,
      venueID: show.venueID,
      showID: props.showID,
    });
    setReminded(true);
    return true;
  };

  useEffect(() => {
    if (
      Number(props.paymentObject?.["amount"]) ===
      Number(props.paymentObject?.["total"]) && props.paymentObject?.["additionalPayment"] === null
    ) {
      setCustom(false);
    }
  }, [props.paymentObject]);

  return props.target ? (
    <>
      <Card className="w-48">
        <div className="flex flex-col flex-grow justify-center items-center w-full relative">
          {!open ? (
            <>
              <Img
                src={props.target.avatar}
                className="w-36 h-36 p-4 rounded-full"
              />
              <div className="flex flex-col w-full flex-grow p-4 pt-0">
                <h1 className="text-xl font-black justify-center text-center">
                  {props.target.name}
                </h1>
                <h1 className="text-3xl font-black text-center">
                  $
                  {props.paymentObject["amount"]
                    ? String(props.paymentObject["amount"])
                    : String(props.paymentObject["total"])}
                </h1>
                {props.paymentObject["additionalPayment"] && custom && (
                  <h1 className="text-3xl font-black text-center">
                    + ${String(props.paymentObject["additionalPayment"])}
                  </h1>
                )}
              </div>
            </>
          ) : (
            <div className="p-2 mt-5 flex flex-col items-center">
              <i
                className="material-symbols-outlined absolute left-2 top-3"
                onClick={() => setOpen(false)}
              >
                arrow_back
              </i>

              {
                //CONTENT FOR CARD
                props.paymentObject["payouts_enabled"] ? (
                  //only show payment screen if user has enabled payouts
                  !props.paymentObject["additionalPayment"] ? (
                    props.paymentObject?.["total"] !==
                    props.paymentObject?.["amount"] ? (
                      <>
                        <h2 className="text-xl font-black text-center">
                          Pay {props.target.name}
                        </h2>
                        <p className="text-center">
                          You are about to pay out $
                          {String(props.paymentObject["total"])} to{" "}
                          {props.target.name}.
                        </p>
                        <Button
                          className="mx-auto mt-2"
                          clickFn={() =>
                            sendPayment({
                              paymentObject: props.paymentObject,
                              SECRET_UID: user.uid,
                              venueID: show.venueID,
                            })
                          }
                        >
                          Pay Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-black text-center">
                          Success!
                        </h2>
                        <i className="material-symbols-outlined text-6xl text-green-400">
                          check_circle_outline
                        </i>
                        <p className="text-center">
                          {props.target.name} has been paid out $
                          {props.paymentObject["amount"]}
                        </p>
                      </>
                    )
                  ) : //ADDITIONAL & SECONDARY PAYMENTS
                  Number(props.paymentObject?.["total"]) +
                      Number(props.paymentObject?.["additionalPayment"]) !==
                    Number(props.paymentObject?.["amount"]) ? (
                    <>
                      <h2 className="text-xl font-black text-center">
                        Pay {props.target.name}
                      </h2>
                      <p className="text-center">
                        You are about to pay out an additional $
                        {String(props.paymentObject["additionalPayment"])} to{" "}
                        {props.target.name}, for a new total of $
                        {Number(props.paymentObject?.["total"]) +
                          Number(props.paymentObject?.["additionalPayment"])}
                      </p>
                      <Button
                        className="mx-auto mt-2"
                        clickFn={() =>
                          sendPayment({
                            paymentObject: props.paymentObject,
                            SECRET_UID: user.uid,
                            venueID: show.venueID,
                          })
                        }
                      >
                        Pay Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-black text-center">
                        Success!
                      </h2>
                      <i className="material-symbols-outlined text-6xl text-green-400">
                        check_circle_outline
                      </i>
                      <p className="text-center">
                        {props.target.name} has been paid out $
                        {props.paymentObject["amount"]}
                      </p>
                    </>
                  )
                ) : //message to send stripe reminder emails
                !reminded ? (
                  <>
                    <h2 className="text-xl font-black text-center">
                      {props.target.name} has not enabled payouts yet.
                    </h2>
                    <p className="text-center">
                      They will not be able to receieve payments for their show
                      until they have completed the Stripe onboarding process.
                      Click the button below to send them a reminder via email.
                    </p>
                    <Button
                      className="mx-auto mt-2"
                      clickFn={() => handleSendStripeReminder()}
                    >
                      Send Reminder
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-black text-center">
                      Reminder Sent!
                    </h2>
                    <i className="material-symbols-outlined text-6xl text-green-400">
                      check_circle_outline
                    </i>
                    <p className="text-center">
                      Check back soon to see if {props.target.name} has updated
                      their payout information.
                    </p>
                  </>
                )
                //CONTENT FOR CARD
              }
            </div>
          )}
        </div>
        {props.viewType === "venue" && !open && (
          <div className="flex flex-col justify-end w-full">
            {
            // (!props.paymentObject?.["paid"] ||
              // (props.paymentObject?.["paid"] && props.remainder > 0)) && (
            }
              <>
                {!custom && !props.paymentObject?.["additionalPayment"] ? (
                  <Button
                    inline
                    onClick={() => setCustom(true)}
                    className="bg-white text-blue-400 w-full border-t border-gray hover:bg-gray-200 transition-all rounded-none p-3"
                  >
                    {props.paymentObject["paid"]
                      ? "Additional Payment"
                      : "Enter Custom Amount"}
                  </Button>
                ) : (
                  <input
                    name={props.target["_key"]}
                    placeholder="Amount"
                    className="border-t w-full text-lg p-1 h-11 text-center"
                    value={
                      (props.paymentObject?.["amount"]
                        ? props.paymentObject?.["additionalPayment"]
                        : props.paymentObject?.["total"]) || ""
                    }
                    onChange={(e) => props.onChange(e)}
                  />
                )}
              </>
            {
            // )
            }
            <PayoutButton
              stripeEnabled={props.paymentObject["payouts_enabled"]}
              overpaid={props.overpaid}
              total={
                Number(props.paymentObject?.["total"]) +
                Number(props.paymentObject?.["additionalPayment"] || 0)
              }
              paid={props.paymentObject["paid"] && !custom}
              onClick={() => setOpen(true)}
            />
          </div>
        )}
      </Card>
    </>
  ) : (
    <></>
  );
}
