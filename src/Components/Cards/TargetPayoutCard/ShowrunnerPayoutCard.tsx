import React from "react";
import { useGetAllShowrunnerGroupsQuery } from "../../../Redux/API/PublicAPI";
import PayoutCardDisplay from "./PayoutCardDisplay";
import { Type } from "../../../Helpers/shared/Models/Type";
import { IPaymentObject } from "../../../Helpers/shared/Models/Payout";

export default function ShowrunnerPayoutCard(props: {
  id: string;
  showID: string;
  paymentObject: IPaymentObject;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  overpaid: boolean;
  viewType: Type;
  remainder: number;
}) {
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners?.data?.[props.id];

  return (
    <PayoutCardDisplay
      target={showrunner}
      showID={props.showID}
      paymentObject={props.paymentObject}
      disabled={props.disabled}
      onChange={props.onChange}
      overpaid={props.overpaid}
      remainder={props.remainder}
      viewType={props.viewType}
    />
  );
}
