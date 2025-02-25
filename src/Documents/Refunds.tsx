import React, { useEffect } from "react";
import { renderPageTitle } from "../Helpers/HelperFunctions";
import Footer from "../Components/Footer";

export default function Refunds() {
    useEffect(() => {
        renderPageTitle("Refund Policy");
    }, []);
    return (
        <div className="flex-col std-pad">
            <h1>TuneHatch Refund Policy</h1>
            <p className="fineprint left">Last Updated: July 5th, 2023</p>

            <p className="std-pad">
                At TuneHatch, we value our customers and strive to offer
                exceptional service. This Refund Policy outlines the conditions
                under which refunds can be requested and granted.
            </p>

            <h2>General Refund Conditions</h2>
            <p className="std-pad">
                Refunds are generally at the venue’s discretion, in accordance
                with local laws. Submitting a refund request does not guarantee
                a refund will be granted.
            </p>
            <h2>Event Rescheduling</h2>
            <p className="std-pad">
                If an event is rescheduled after you have already purchased a
                ticket, you will be eligible for a refund of the face value of
                the ticket and associated taxes if a claim is started within 72
                hours of receiving notice from us via email.
            </p>
            <h2>Event Cancellation</h2>
            <p className="std-pad">
                If an event is canceled and not rescheduled, you will be
                eligible for a refund of the face value of the ticket and
                associated taxes. The refund must be claimed within 14 days of
                the event’s cancellation notice.
            </p>
            <h2>User Error</h2>
            <p className="std-pad">
                Refunds requested due to end user error, such as, but not
                limited to, purchasing more tickets than intended, selecting the
                wrong event, or inputting incorrect information, will not be
                eligible for refund.
            </p>
            <h2>Exception to User Error</h2>
            <p className="std-pad">
                If user error occurs and a refund is requested within 24 hours
                of purchase or prior to the start of the show to which the
                tickets pertain, whichever comes first, the face value of the
                tickets and associated taxes may be eligible for refund, at the
                discretion of the TuneHatch customer service team.
            </p>
            <h2>Refund Initiation Window</h2>
            <p className="std-pad">
                All refunds, with the exception of “event rescheduling” and
                “event cancellation,” must be initiated by the ticket purchaser
                prior to the start of the show for which the tickets to be
                refunded were purchased. Any refund requests initiated after the
                show begins will automatically be rejected.
            </p>
            <h2>Payment Method for Refunds</h2>
            <p className="std-pad">
                Refunds will be processed to the original method of payment used
                at the time of purchase. Please allow up to 14 business days for
                the refund to reflect in your account.
            </p>
            <h2>Service Fees</h2>
            <p className="std-pad">
                Please note that service fees are non-refundable.
            </p>
            <h2>Third-Party Purchases</h2>
            <p className="std-pad">
                Tickets purchased through third-party vendors, including
                resellers, are not eligible for a refund through TuneHatch. You
                must contact the third-party vendor for their specific refund
                policy.
            </p>
            <h2>External Factors</h2>
            <p className="std-pad">
                TuneHatch is not responsible for refunds in circumstances beyond
                its control, such as weather conditions, natural disasters, or
                decisions by governmental entities that affect the event.
            </p>
            <h2>Contacting the Venue</h2>
            <p className="std-pad">
                In cases where you are not eligible for a refund through
                TuneHatch, you must contact the venue directly. The venue will
                make the final decision regarding refunds.
            </p>
            <h2 className="centered">Contacting TuneHatch</h2>
            <h3 className="std-pad centered">
                For further information on refunds, or to start a refund claim,
                send us an email at info@tunehatch.com.
                <br />
                Please note that this policy is subject to change. We encourage
                you to review it regularly.
                <br />
                Thank you for choosing TuneHatch!
            </h3>
            <Footer />
        </div>
    );
}
