import React from "react";
import Payouts from "../../Images/Education/payouts.png";
import pic2 from "../../Images/Education/payoutpic2.png";

export default function PayOuts() {
  return (
    <div>
      <div className="flex lg:flex-row flex-col whole-margin">
        <div className="lg:order-3 flex lg:flex-col flex-row items-start lg:bg-[#A0CD7F]">
          <div className="lg:justify-between p-6 space-y-4">
            <h2 className="lg:text-white font-inter font-bold text-[3rem] mt-6">
              Pay-Outs
            </h2>
            <p className="lg:text-white font-inter font-bold text-xl  pt-6">
              There's an Easier Way to Pay Artists After the Show!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-6 pr-6 ml-auto">
              <button className="bg-white text-[#0F728F] font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-100 transition-colors">
                <a href="https://tunehatch.com/register">Sign Up</a>
              </button>
              <button className="bg-[#0F728F] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors">
                <a href="https://calendly.com/nathan-tunehatch/30min">
                  Book a Demo
                </a>
              </button>
            </div>
          </div>
        </div>
        <img
          className="lg:order-1 lg:w-[60vw] lg:ml-auto lg:max-w-[1000px]"
          src={Payouts}
          alt="Payouts"
        />
      </div>

      <div className="lg:pl-10 lg:pr-20 pl-3 pr-3">
        <div className="flex lg:flex-row flex-col mt-10 flex-container">
          <div className="lg:w-1/4 p-3 border rounded-md ml-5 toc">
            <div className="ml-4 mb-4">
              <div className="mt-3 mb-3 text-black font-inter font-bold leading-none">
                Table of Contents
              </div>
              <p className="mb-3 leading-none">
                <a href="#qrcode">Overview</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#hvsv">Secure Payments, Every Time</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#poa">Paying Out Artists</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#poyv">Paying Out Your Venue</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#pona">Paying Out Non-Artists</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#faster-line">Flexibility to Change, Anytime</a>
              </p>
            </div>
          </div>

          <div className="ml-8 hatch-title w-[55vw]">
            <h1 className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] lg:pb-5">
              Pay Artists in One Click!
            </h1>
            <p className="text-green-500 font-inter font-bold leading-normal text-2xl italic">
              Settle your shows in a way that’s transparent, seamless, and
              doesn’t leave you holding onto left behind cash or writing
              physical checks.
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[50%] pr-[5rem] dynamic-qr-container">
            <h1
              id="qrcode"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8"
            >
              Overview
            </h1>
            <p className="mb-3">
              Tired of chasing down artists to collect their payment at the end
              of the night or asking around for who handles the money for the
              band?
            </p>
            <p className="mb-3">
              Well, TuneHatch Pay Outs are the solution, letting you pay
              artists, collect production fees, and settle your shows quickly
              and correctly, every time.
            </p>
          </div>

          <div>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/Fh0NFm4Sh0U?si=BxVywbjilySBBRBc"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="ml-5">
          <div className="max-w-[80%]">
            <h1
              id="hvsv"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8"
            >
              Secure Payments, Every Time
            </h1>
            <p className="mb-3">
              {" "}
              All payouts are processed through our secure payments processor,
              Stripe. Personal, banking, and card information are not accessible
              to TuneHatch or visible to anyone else. Your personal payment
              information is only visible to you!
            </p>
            <p className="mb-3">
              Stripe also handles 1099K’s, so you don’t have to.
            </p>
          </div>
        </div>

        <div className="ml-5">
          <div className="max-w-[80%]">
            <h1
              id="poa"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8"
            >
              Paying Out Artists
            </h1>
            <p className="mb-3">
              {" "}
              When an artist is on your lineup for any given show, they
              automatically show up on the payouts screen for that show, so you
              don’t have to do extra work.{" "}
            </p>
            <p className="mb-3">
              How does TuneHatch know where to send the payments? When an artist
              is added to a lineup, they are prompted to add their secure
              payment information to Stripe, which automatically links to their
              profile. So, when the show concludes, artists will be all set up
              to receive payments!
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[60%] pr-[5rem] dynamic-qr-container">
            <h1
              id="poyv"
              className="text-black font-inter font-bold lg:text-5xl text-[2.4rem] mt-8"
            >
              Paying Out Your Venue:{" "}
            </h1>
            <h2 className="text-black font-inter font-bold leading-normal text-3xl">
              Collecting Production Fees & Ticket Splits
            </h2>
            <p className="mb-3">
              {" "}
              Production Fees: Do you have a standard production fee? This fee
              will automatically be included in your payouts screen, and can be
              adjusted if the band covers it in cash or otherwise.
            </p>
            <p className="mb-3">
              Ticket Splits: If you have a ticket split agreement with the
              artists on your bill, your payouts screen will show you how much
              is due to each person, so you don’t have to calculate the dollars
              and cents. You can also manually update or change this amount,
              whenever you need to.
            </p>
          </div>
          <div className="lg:max-w-[40%]">
            <img src={pic2} alt="A picture of payout" />
          </div>
        </div>

        <div className="ml-5">
          <div className="lg:max-w-[80%]">
            <h1
              id="pona"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Paying Out Non-Artists: Promoters, Managers, and More
            </h1>
            <p className="mb-3">
              Paying out promoters, managers, and other non-artist payees is
              just as easy! Simply add the non-artist payee to your payouts
              screen for any show, and click “pay out.” That’s it!{" "}
            </p>
          </div>
        </div>

        <div className="ml-5">
          <div className="lg:max-w-[80%]">
            <h1
              id="faster-line"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Flexibility to Change, Anytime
            </h1>
            <p className="mb-3">
              Details are always changing with show management. Whether an
              artist drops off the bill, another artist is added, or the payment
              agreement between the venue and artists changes for any other
              reason, you have the flexibility to change how much money goes to
              whom, at any time, keeping you in control as things change.{" "}
            </p>
          </div>
        </div>

        <div className="bg-[#A0CD7F] flex flex-row items-center justify-between rounded-lg sm:mb-52 md:mb-2 lg:mb- ml-4 mr-4">
          <div className="text-white font-inter font-bold leading-normal lg:text-2xl text-[2rem] my-8 pl-11">
            Need Support?
          </div>
          <div className="flex flex-col lg:flex-row gap-4 pt-6 pb-6 pr-6 ml-auto">
            <button className="bg-white text-[#0F728F] font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-100 transition-colors">
              <a href="https://tunehatch.com/register">Sign Up</a>
            </button>
            <button className="bg-[#0F728F] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors">
              <a href="https://calendly.com/nathan-tunehatch/30min">
                Book a Demo
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
