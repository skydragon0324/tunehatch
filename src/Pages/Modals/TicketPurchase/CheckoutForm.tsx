import React, { useMemo } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import metaPixel from "react-facebook-pixel";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PUBLIC_URL } from "../../../Helpers/configConstants";
import { updateView } from "../../../Redux/UI/UISlice";
import Button from "../../../Components/Buttons/Button";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import { useGenerateTicketsMutation } from "../../../Redux/API/PublicAPI";
import { useAppSelector } from "../../../hooks";
import FormInput from "../../../Components/Inputs/FormInput";

const ReactPixel = metaPixel;

function CheckoutForm(props: {
  email?: string;
  name?: string;
  metaPixel?: any;
  total?: number;
  intentID?: string;
  doorPurchase?: boolean;
  SECRET_UID?: string;
  showID?: string;
  venueID?: string;
  clientSecret?: string;
  updateEmailFn: (email: string) => void;
  updateNameFn: (name: string) => void;
}) {
  const stripe = useStripe();
  const cart = useAppSelector((state) => state.user.cart);
  const [triggerGenerateTickets] = useGenerateTicketsMutation();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [email, setEmail] = useState(props.email);
  const [name, setName] = useState(props.name);
  // const [emailConfirmed, setEmailConfirmed] = useState(props.email !== null);
  const emailConfirmed = useMemo(() => props.email !== null, [props.email]);
  const [processing, setProcessing] = useState(false);
  // const [prIsUpdating, setPRUpdating] = useState(paymentRequest !== null);
  const [elementsReady, setElementsReady] = useState(false);
  const [forceCard, setForceCard] = useState(false);
  // const checkoutButton = useRef();
  const elements = useElements();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.metaPixel) {
      // const advancedMatching = {};
      // const options = {
      //   autoConfig: true,
      //   debug: true,
      // };
      console.log("meta pixel initialized");
      ReactPixel.init(props.metaPixel);
    } else {
      console.log("meta pixel not initialized");
    }
  }, [props.metaPixel]);

  const pixelPurchase = () => {
    if (props.metaPixel) {
      ReactPixel.track("Purchase", { currency: "USD", value: props.total });
    }
  };

  const generateTickets = async (name?: string, email?: string) => {
    triggerGenerateTickets({
      intentID: props.intentID,
      method: props.doorPurchase ? "Door Purchase" : "Presale",
      name: name || props.name,
      cart: cart,
      SECRET_UID: props.SECRET_UID,
      email: email || props.email,
      showID: props.showID,
      venueID: props.venueID,
    });
    dispatch(updateView({ target: "ticketPurchase", view: 2 }));
  };

  const recheckPayment = async () => {
    if (stripe) {
      const pr = await stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "TuneHatch",
          amount: props.total * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      const result = await pr.canMakePayment();
      if (result) {
        setPaymentRequest(pr);
      } else {
        console.log("Can't use mobile wallet");
      }
      pr.on("paymentmethod", async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            props.clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );
        console.log(ev);
        let payerName = ev.payerName;
        let payerEmail = ev.payerEmail;
        if (confirmError) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          ev.complete("fail");
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete("success");
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
          if (paymentIntent.status === "requires_action") {
            // Let Stripe.js handle the rest of the payment flow.
            const { error } = await stripe.confirmCardPayment(
              props.clientSecret
            );
            if (error) {
              // The payment failed -- ask your customer for a new payment method.
            } else {
              dispatch(updateView({ target: "ticketPurchase", view: 2 }));
              pixelPurchase();
              generateTickets(payerName || name, payerEmail || email);
            }
          } else {
            pixelPurchase();
            generateTickets(payerName || name, payerEmail || email);
          }
        }
      });
    }
  };

  useEffect(() => {
    recheckPayment();
  }, [stripe, cart]);

  useEffect(() => {}, [paymentRequest]);

  const handleSubmit = async (event: React.FormEvent) => {
    setProcessing(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: PUBLIC_URL,
        payment_method_data: {
          billing_details: {
            email: email || props.email,
            name: props.name,
          },
        },
      },
      redirect: "if_required",
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setProcessing(false);
      console.log(result.error.message);
    } else {
      console.log(result);
      dispatch(updateView({ target: "ticketPurchase", view: 2 }));
      setProcessing(false);
      pixelPurchase();
      generateTickets();
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          {paymentRequest && (
            <>
              <PaymentRequestButtonElement options={{ paymentRequest }} />
              <button
                className="inlineButton noBorder fullWidth sm-top"
                onClick={(e) => {
                  e.preventDefault();
                  setForceCard(true);
                }}
              >
                Enter Card Details Manually
              </button>
            </>
          )}
          {!emailConfirmed ? (
            <div className="flex-col">
              <FormInput
                label="Purchaser Name"
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <FormInput
                label="Ticket Email"
                placeholder="Ticket Email"
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <div className="flex gap-4">
                {/* <button className={`text-lg w-full p-2 m-2 mx-auto text-center border-2  hover:bg-gray-100 rounded-full`} onClick={(e) => { e.preventDefault(); props.updateEmailFn(false) }}>Skip</button> */}
                <button
                  className={`text-lg w-full p-2 m-2 mx-auto  text-center border-2 filter brightness-110 bg-orange text-white rounded-full`}
                  onClick={(e) => {
                    e.preventDefault();
                    props.updateEmailFn(email);
                    props.updateNameFn(name);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            stripe &&
            elements && (
              <>
                <PaymentElement onReady={() => setElementsReady(true)} />
                <p className="text-center text-gray-400 text-xs m-1 mx-4">
                  By pressing the Purchase button, you acknowledge you have read and agree to our <a className="text-blue-400" href="https://tunehatch.com/tos" target="_blank" rel="noreferrer">Terms of Service</a>, <a className="text-blue-400" href="https://tunehatch.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>, and <a className="text-blue-400" href="https://tunehatch.com/refunds" target="_blank" rel="noreferrer">Refund Policy</a>.
                </p>
                {elementsReady ? (
                  <Button className="w-full" disabled={!stripe}>
                    Purchase
                  </Button>
                ) : (
                  <LoadingSpinner />
                )}
              </>
            )
          )}
        </form>
        <div
          className={`flex items-center justify-center absolute top-0 left-0 w-screen h-screen bg-white transition-all ${
            processing ? "opacity-30" : "opacity-0 hidden"
          }`}
        ></div>
        <div
          className={`flex items-center justify-center absolute top-0 left-0 w-screen h-screen transition-all ${
            processing ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <LoadingSpinner className="opacity-100" />
        </div>
      </div>
    </>
  );
}

export default CheckoutForm;
