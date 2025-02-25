import React from "react";
import ArtistPayoutCard from "./ArtistPayoutCard";
import ShowrunnerPayoutCard from "./ShowrunnerPayoutCard";
import VenuePayoutCard from "./VenuePayoutCard";
import { Type } from "../../../Helpers/shared/Models/Type";
import { IPaymentObject } from "../../../Helpers/shared/Models/Payout";

export default function TargetPayoutCard(props: {
  id: string;
  showID: string;
  paymentObject: IPaymentObject;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  overpaid: boolean;
  remainder: number;
  viewType: Type;
}) {
  switch (props.paymentObject["type"]) {
    case "artist":
      return (
        <ArtistPayoutCard
          id={props.id}
          showID={props.showID}
          paymentObject={props.paymentObject}
          disabled={props.disabled}
          onChange={props.onChange}
          overpaid={props.overpaid}
          remainder={props.remainder}
          viewType={props.viewType}
        />
      );
    case "showrunner":
      return (
        <ShowrunnerPayoutCard
          id={props.id}
          showID={props.showID}
          paymentObject={props.paymentObject}
          disabled={props.disabled}
          onChange={props.onChange}
          overpaid={props.overpaid}
          remainder={props.remainder}
          viewType={props.viewType}
        />
      );
    case "venue":
      return (
        <VenuePayoutCard
          id={props.id}
          showID={props.showID}
          paymentObject={props.paymentObject}
          disabled={props.disabled}
          onChange={props.onChange}
          overpaid={props.overpaid}
          remainder={props.remainder}
          viewType={props.viewType}
        />
      );
    default:
      return (
        <ArtistPayoutCard
          id={props.id}
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
}
