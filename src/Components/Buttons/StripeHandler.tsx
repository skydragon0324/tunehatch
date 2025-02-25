import React, { useEffect, useState } from "react";
import { Type } from "../../Helpers/shared/Models/Type";
import { APIURL } from "../../Helpers/configConstants";
import axios from "axios";
import { useAppSelector } from "../../hooks";
import Button from "./Button";
import LabelButton from "./LabelButton";

export default function StripeHandler(props: {
  viewType: Type;
  targetID: string;
  stripeID?: string;
  className?: string;
  useLabelButton?: boolean;
}) {
  const user = useAppSelector((state) => state.user.data);
  const [stripeLink, setStripeLink] = useState(null);
  const getStripeAccount = async () => {
    let stripeRequest = await axios.post(APIURL + `ind/stripe-request`, {
      SECRET_UID: user.uid,
      venueID: props.viewType === "venue" ? props.targetID : null,
      viewType: props.viewType,
      targetID: props.targetID,
      stripeID: props.stripeID,
    });
    setStripeLink(stripeRequest.data.url);
  };

  useEffect(() => {
    if (props.viewType && props.targetID && !stripeLink && user.uid) {
      getStripeAccount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, props]);

  return (
    <div className="flex">
      {!props.useLabelButton ? (
        stripeLink ? (
          <Button link={stripeLink} newTab>
            Manage Payouts
          </Button>
        ) : (
          <Button pendingState="pending">Loading Payouts Securely...</Button>
        )
      ) : stripeLink ? (
        <LabelButton
          className={`${
            props.className ? props.className : "bg-amber-500 text-white"
          }`}
          link={stripeLink}
          newTab
        >
          Manage Payouts
        </LabelButton>
      ) : (
        <LabelButton
          className={`${
            props.className ? props.className : "bg-amber-500 text-white"
          }`}
        >
          Loading Payouts Securely...
        </LabelButton>
      )}
    </div>
  );
}
