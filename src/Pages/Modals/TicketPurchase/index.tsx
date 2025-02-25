import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { loadStripe } from "@stripe/stripe-js";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
  useSetPaymentIntentMutation,
} from "../../../Redux/API/PublicAPI";
import LoadingWrapper from "../../../Components/Layout/LoadingWrapper";
import ErrorPage from "../../404";
import { STRIPE_PUBLIC } from "../../../Helpers/configConstants";
import TicketPurchaseCard from "./TicketPurchaseCard";
import { calculateCartTotal } from "../../../Helpers/shared/calculateCartTotal";
import { useAppSelector } from "../../../hooks";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../Redux/User/UserSlice";
import Button from "../../../Components/Buttons/Button";
import { resetView, updateView } from "../../../Redux/UI/UISlice";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
// import axios from "axios";
import TicketGeneration from "./TicketGeneration";
import GoogleMapsEmbed from "../../../Components/Embeds/GoogleMapsEmbed";
import IconLabel from "../../../Components/Labels/IconLabel";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import Img from "../../../Components/Images/Img";
// import { useShowTimes } from "../../../Hooks/useShowTimes";

const stripePromise = loadStripe(STRIPE_PUBLIC);
export default function TicketPurchase(props: {
  showID: string;
  free?: boolean;
  darkMode?: boolean;
  defaultQuantity?: number;
  doorPurchase?: boolean;
}) {
  const [showDate, setShowDate] = useState(null);
  const [showStartTime, setShowStartTime] = useState(null);

  const dispatch = useDispatch();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[show?.venueID];
  const venueFee = Number(venue?.venueFee || 0);
  const cart = useAppSelector((state) => state.user.cart);
  const user = useAppSelector((state) => state.user.data);
  const [email, updateEmail] = useState(user?.email);
  const [name, updateName] = useState(user?.firstname);
  const currentView = useAppSelector(
    (state) => state.ui.views.ticketPurchase.view
  );
  const [setPaymentIntent, intentData] = useSetPaymentIntentMutation();
  const [stripeLoading, setStripeLoading] = useState("idle");
  var tiers = show?.ticket_tiers;
  if (tiers) {
    tiers = Object.keys(tiers);
  } else {
    tiers = ["0"];
  }
  useEffect(() => {
    if (show) {
      const humanTimestamp = dayjs(show?.starttime);
      const month = humanTimestamp.format("MMMM");
      const date = humanTimestamp.format("D");
      const hour = humanTimestamp.format("hA");
      setShowStartTime(hour);
      setShowDate(month + " " + date);
    }
  }, [show]);
  const [cartTotal, setCartTotal] = useState(calculateCartTotal(cart));
  useEffect(() => {
    return () => {
      dispatch(resetView("ticketPurchase"));
      dispatch(clearCart());
    };
  }, []);
  useEffect(() => {
    setCartTotal(calculateCartTotal(cart));
  }, [cart]);
  async function getIntent() {
    setStripeLoading("pending");
    let reqTime = Date.now();
    if (show && cartTotal.total > 0) {
      await setPaymentIntent({
        showID: show._key,
        cart: cart,
        name: user.firstname ? `${user.firstname} ${user.lastname}` : "",
        email: user.email ? user.email : email,
        intentID: intentData?.data?.id,
        requestTimestamp: reqTime,
      });
    }
  }
  useEffect(() => {
    if (intentData.isSuccess && !intentData.isLoading) {
      setStripeLoading("completed");
    } else {
      setStripeLoading("pending");
    }
  }, [intentData]);
  useEffect(() => {
    getIntent();
  }, [cartTotal, email]);
  console.log(show.custom_fee);
  return (
    <LoadingWrapper queryResponse={[shows]}>
      {show ? (
        !props.free ? (
          <div className="flex flex-col h-full max-h-full p-4">
            <div className="flex flex-col flex-grow gap-2">
              <h1 className="font-black text-3xl text-center pb-2">
                {show.name}
              </h1>
              {show?.ticketImage && (
                <>
                  <Img src={show.ticketImage} className="w-full md:h-80 md:w-80 mx-auto mb-2" />
                </>
              )}
              {currentView === 0 &&
                tiers.map((tierNumber: number, i: number) => {
                  if (!show.ticket_tiers) {
                    return (
                      <TicketPurchaseCard
                        doorPurchase={props.doorPurchase}
                        defaultQuantity={props.defaultQuantity || 0}
                        showID={props.showID}
                        remainingTickets={show.remainingTickets}
                        // kevin TODO: This should just be a number,
                        // but it has to be changed upstream first.
                        price={
                          typeof show.ticket_cost === "string"
                            ? parseInt(show.ticket_cost, 10)
                            : show.ticket_cost
                        }
                        venueFee={venueFee}
                        name={show.name}
                        customFee={show.custom_fee}
                        customTax={show.custom_tax}
                      />
                    );
                  } else {
                    let tier = show.ticket_tiers[tierNumber];
                    console.log(tier);
                    return (
                      <TicketPurchaseCard
                        doorPurchase={props.doorPurchase}
                        showID={props.showID}
                        price={tier?.price}
                        tier={tier}
                        tierNumber={tierNumber}
                        tierName={tier?.name}
                        tierDescription={tier?.description}
                        remainingTickets={tier?.quantity}
                        venueFee={venueFee}
                        name={show.name}
                        customFee={tier?.custom_fee}
                        customTax={tier?.custom_tax}
                      />
                    );
                  }
                })}
              {currentView === 1 && (
                <>
                  {stripeLoading === "completed" ? (
                    <>
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret: intentData.data?.secret,
                          appearance: {
                            theme: props.darkMode ? "night" : "stripe",
                          },
                        }}
                      >
                        <CheckoutForm
                          SECRET_UID={user.uid}
                          name={
                            user.firstname
                              ? `${user.firstname} ${user.lastname}`
                              : name
                          }
                          updateNameFn={updateName}
                          email={email}
                          updateEmailFn={updateEmail}
                          // cart={cart}
                          clientSecret={intentData.data?.secret}
                          doorPurchase={props.doorPurchase}
                          showID={props.showID}
                          venueID={show.venueID}
                          intentID={intentData.data?.id}
                          metaPixel={show.metaPixel}
                          total={cartTotal.total}
                        />
                      </Elements>
                    </>
                  ) : (
                    <div className="w-full flex justify-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </>
              )}
              {currentView === 2 && (
                <>
                  <TicketGeneration />
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full">
                <p className="font-medium">Ticket Price: </p>
                <p>{cartTotal.base_cost}</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="font-medium">Processing Fees: </p>
                <p>{cartTotal.fee}</p>
              </div>
              {cartTotal.venueFee ? (
                <div className="flex justify-between w-full">
                  <p className="font-medium">Venue Fee: </p>
                  <p>{cartTotal.venueFee}</p>
                </div>
              ) : (
                <></>
              )}
              <div className="flex justify-between w-full">
                <p className="font-medium">Tax: </p>
                <p>{cartTotal.tax}</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="font-medium">Total: </p>
                <p>{cartTotal.total}</p>
              </div>
              {cartTotal.base_cost && currentView === 0 ? (
                <Button
                  action={updateView({ target: "ticketPurchase", view: 1 })}
                  className="bg-orange text-white w-full"
                  animateWide
                >
                  Purchase
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div className="w-full mt-10">
            <h1 className="text-3xl font-black text-center">
              This is a free show!
            </h1>
            <p className="text-center">
              That means there's no need to purchase a ticket. See you there!
            </p>
            <div className="flex flex-col text-center">
              <div className="flex">
                <GoogleMapsEmbed
                  address={
                    venue?.location?.address +
                    " " +
                    venue?.location?.city +
                    " " +
                    venue?.location?.state +
                    " " +
                    venue?.location?.zip
                  }
                />
              </div>
              <div className="bg-amber-500">
                <div className="text-white font-bold p-2">
                  <IconLabel className="flex-col" icon="today">
                    {" "}
                    {showDate} <br /> {showStartTime}{" "}
                  </IconLabel>

                  <div className="mt-2">
                    <IconLabel
                      className="flex-col text-center"
                      iconClassName=" text-center"
                      icon="location_on"
                    >
                      {venue?.location?.address}
                      <br />
                      {venue?.location?.city + " " + venue?.location?.state}{" "}
                      <br />
                      {venue?.location?.zip}
                    </IconLabel>
                  </div>
                  <h2 className="text-2xl p-2 mt-2">Don't miss out.</h2>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <ErrorPage />
      )}
    </LoadingWrapper>
  );
}
