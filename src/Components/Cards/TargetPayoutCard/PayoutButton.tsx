import React, { useEffect, useState } from "react";
import Button from "../../Buttons/Button";

export default function PayoutButton(props: {
  stripeEnabled: boolean;
  overpaid: boolean;
  total: number;
  paid: boolean;
  onClick: () => void;
}) {
  const [buttonStatus, setButtonStatus] = useState({
    buttonClass:
      "bg-blue-500 w-full text-white rounded-tr-none rounded-tl-none",
    buttonText: "Pay",
  });
  useEffect(() => {
    let buttonText = "Pay";
    if (props.paid) {
      buttonText = "Paid";
    } else if (!props.stripeEnabled) {
      buttonText = "Attention";
    }
    let buttonClass =
      "bg-blue-500 w-full text-white rounded-tr-none rounded-tl-none";
    if (!props.stripeEnabled && !props.paid) {
      buttonClass =
        "bg-red-400 w-full text-white rounded-tr-none rounded-tl-none";
    }
    if (props.overpaid && !props.paid) {
      buttonClass =
        "bg-gray-400 w-full text-white rounded-tr-none rounded-tl-none";
    }
    if (props.paid) {
      buttonClass =
        "bg-green-400 w-full text-white rounded-tr-none rounded-tl-none";
    }
    setButtonStatus({ buttonClass, buttonText });
  }, [props.stripeEnabled, props.overpaid, props.paid]);

  return (
    <Button
      onClick={() => props.onClick()}
      inline
      disabled={props.overpaid || props.total === 0}
      className={buttonStatus.buttonClass}
    >
      {buttonStatus.buttonText}
    </Button>
  );
}
