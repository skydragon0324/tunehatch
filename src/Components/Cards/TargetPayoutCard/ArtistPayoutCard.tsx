import React from "react";
import { useGetAllArtistsQuery } from "../../../Redux/API/PublicAPI";
import PayoutCardDisplay from "./PayoutCardDisplay";
import { Type } from "../../../Helpers/shared/Models/Type";
import { getDisplayName } from "../../../Helpers/HelperFunctions";
import { IPaymentObject } from "../../../Helpers/shared/Models/Payout";

export default function ArtistPayoutCard(props: {
  id: string;
  showID: string;
  paymentObject: IPaymentObject;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  overpaid: boolean;
  remainder: number;
  viewType: Type;
}) {
  const artists = useGetAllArtistsQuery();
  const artist = artists?.data?.[props.id];
  return (
    <PayoutCardDisplay
      target={{
        ...artist,
        name: getDisplayName("artist", artist),
        type: "artist",
      }}
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
