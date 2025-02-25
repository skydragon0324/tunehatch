import React from "react";
import FAQTile from "../Components/Tiles/FAQTile";

export default function FAQ() {
  return (
    <div className="text-center p-2">
      <h2 className="text-2xl font-bold ">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 gap-4 items-center">
        <FAQTile
          question="Who handles refunds for ticketed shows?"
          answer="Our TuneHatch customer support team handles all refunds on behalf of our partner venues. Please see our Refund Policy for more information."
        />
        <FAQTile
          question="How much does it cost to use TuneHatch?"
          answer="It's free! We created a solution that is sustainable and free for the communities we serve."
        />
        <FAQTile
          question="[Venue] How do I get paid for shows?"
          answer="We've partnered with Stripe to provide secure, direct deposit payouts for shows. You can set up your payout account on your profile through “Manage Venues” -> “Edit Venue -> “Payouts & Embeds” -> “Manage Payouts”. Payouts for each show are processed in 3-5 days. You can monitor your ticket sales and expected payouts in real time by clicking “Manage Details” on any of your published shows."
        />
        <FAQTile
          question="[Artist] How do I get paid for shows?"
          answer="We've partnered with Stripe to provide secure, direct deposit payouts for shows. Once you've set up your payout account on your profile through “Manage Payouts”, your payouts for each show are processed in 3-5 days. You can monitor your ticket sales and expected payout in real time by going to “Manage Shows” and selecting any of your upcoming shows."
        />
        <FAQTile
          question="When I apply to a gig, what am I sending in as my application?"
          answer="Your profile! Make sure it's fully filled out so that venues can see what a great fit you are for their shows."
        />
        <FAQTile
          question="How do I carry over my existing shows and calendar holds to TuneHatch?"
          answer="Our customer support team will do all the heavy lifting for you! We'll carry over your shows and make sure that all the details and presentation are to your liking."
        />
        <FAQTile
          question="How do I make sure that business doesn't stop and information doesn't get lost?"
          answer="Our customer support team will review everything with you before your shows go live, and provide in person support for as long as is needed until you feel comfortable using TuneHatch independently."
        />
      </div>
    </div>
  );
}
