import React from "react";
import Card from "../../../Components/Layout/Card";
import PurchaseCounter from "./PurchaseCounter";

export default function TicketPurchaseCard(props: {
  showID: string;
  tier?: any;
  tierNumber?: number;
  tierName?: string;
  tierDescription?: string;
  tierColorCode?: string;
  price: number;
  venueFee: number;
  defaultQuantity?: number;
  doorPurchase?: boolean;
  name?: string;
  remainingTickets?: number;
  customFee?: number;
  customTax?: number;
}) {
  return (
    <>
      <Card>
        <div className={`flex gap-2 p-4 items-center w-full ${props.tier?.colorCode ? props.tier.colorCode : ""}`}>
          <div className="flex">
            <h1 className="text-2xl font-black">${props.price}</h1>
          </div>
          <div className="flex flex-grow">
            <h1>
              <span className="text-2xl font-black">
                {props.tierName || "TuneHatch Ticket"}
                <br />
              </span>
              {props.tierDescription}
            </h1>
          </div>
          <div className="flex flex-shrink-0">
            <PurchaseCounter
              doorPurchase={props.doorPurchase}
              showID={props.showID}
              defaultQuantity={props.defaultQuantity}
              tier={props.tier}
              tierNumber={props.tierNumber}
              remainingTickets={props.remainingTickets}
              price={props.price}
              venueFee={props.venueFee}
              customFee={props.customFee}
              customTax={props.customTax}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
