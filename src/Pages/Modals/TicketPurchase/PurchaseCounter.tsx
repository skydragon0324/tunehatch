import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { updateCart } from "../../../Redux/User/UserSlice";

export default function PurchaseCounter(props: {
  showID: string;
  defaultQuantity?: number;
  price: number | string;
  venueFee: number;
  customFee?: number;
  customTax?: number;
  tier?: number | string;
  tierNumber?: number | string;
  doorPurchase?: boolean;
  remainingTickets?: number;
}) {
  const dispatch = useAppDispatch();
  const price = Number(props.price);
  const tierNumber = String(props.tierNumber || 0);
  const cart = useAppSelector((state) => state.user.cart);

  useEffect(() => {
    dispatch(
      updateCart({
        showID: props.showID,
        tierNumber: tierNumber,
        price: price,
        customFee: props.customFee,
        customTax: props.customTax,
        venueFee: props.venueFee,
        quantity: props.defaultQuantity,
      }),
    );
  }, []);
  return (
    <>
      <div className="flex-col">
        <div className="flex gap-1 items-center">
        <div
          className="bg-orange rounded-full w-6 h-6 flex items-center justify-center"
          onClick={() =>
            dispatch(
              updateCart({
                showID: props.showID,
                tierNumber: tierNumber,
                price: price,
                venueFee: props.venueFee,
                customFee: props.customFee,
                customTax: props.customTax,
                quantity: cart[props.showID]?.[tierNumber]?.quantity - 1,
              }),
            )
          }
        >
          <i className="material-symbols-outlined text-white">
            keyboard_arrow_down
          </i>
        </div>
        <div>
          <h1 className="text-2xl font-black">
            {cart[props.showID]?.[tierNumber]?.quantity}
          </h1>
        </div>
        <div
          className={`${cart[props.showID]?.[tierNumber]?.quantity < (props.doorPurchase ? 999 : props.remainingTickets) ? "bg-orange" : "bg-gray-400"} rounded-full w-6 h-6 flex items-center justify-center`}
          onClick={() => cart[props.showID]?.[tierNumber]?.quantity < (props.doorPurchase ? 999 : props.remainingTickets) ?
            dispatch(
              updateCart({
                showID: props.showID,
                tierNumber: tierNumber,
                customFee: props.customFee,
                customTax: props.customTax,
                venueFee: props.venueFee,
                price: price,
                quantity: cart[props.showID]?.[tierNumber]?.quantity + 1,
              }),
            ) : null
          }
        >
          <i className="material-symbols-outlined text-white">
            keyboard_arrow_up
          </i>
        </div>
      </div>
      {props.remainingTickets <= 10 && !props.doorPurchase ? props.remainingTickets === 0 ? <p className="text-center p-1 bg-red-400 mt-1 text-xs rounded text-white">SOLD OUT!</p> : <p className="text-center p-1 bg-red-400 mt-1 text-xs rounded text-white">{props.remainingTickets} left!</p> : <></>}
      </div>
    </>
  );
}
