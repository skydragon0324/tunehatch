import React from "react";
import "../Main.css";
import HatchBg from "../Images/Backgrounds/HatchBackground.png";
import Venmo from "../Images/Hatch Code/venmo.png";
import TH from "../Images/TextLogo.png";
import QRCode from "../Images/Hatch Code/qr-code.png";
import buckets from "../Images/Hatch Code/buckets.png";
import HatchCodeImage from "../Images/Hatch Code/HatchCode.png";
import qrcode from "../Images/Education/qrcode.png";

export default function HatchCode() {
  return (
    <div>
      <div className="relative whole-margin">
        <img className="w-full h-auto" src={HatchBg} alt="The Hatch Picture" />
        <div className="lg:absolute lg:top-[25%] left-10 z-10 space-y-4 hatch-code-container lg:p-0 p-5">
          <img
            src={HatchCodeImage}
            alt="Hatch Codes"
            className="h-16 hatch-code lg:invert-0 invert"
          />
          <h2 className="text-white font-inter font-bold text-3xl hatch-code lg:invert-0 invert">
            Organize & Optimize Door Sales
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-100 transition-colors">
              <a href="https://tunehatch.com/register"> Sign Up</a>
            </button>
            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors">
              <a href="https://calendly.com/nathan-tunehatch/30min">
                Book a Demo
              </a>
            </button>
          </div>
        </div>
      </div>

      <div className="pl-10 pr-20">
        <div className="flex lg:flex-row flex-col mt-10 flex-container">
          <div className="lg:w-[50%] lg:p-3 border rounded-md lg:ml-5 toc mb-5">
            <div className="ml-4 mb-4">
              <div className="mt-3 mb-3 text-black font-inter font-bold leading-none">
                Table of Contents
              </div>
              <p className="mb-3 leading-none">
                <a href="#overview">Overview</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#hvsv">HatchCode vs. Venmo</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#qrcode">Dynamic QR Code</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#faster-line">Faster Lines, Secure Tickets</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#bucketing">"Bucketing" your shows</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#no-pos">POS System</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#hatch-code">Implementing Hatch Codes</a>
              </p>
            </div>
          </div>

          <div className="lg:ml-8 hatch-title">
            <h1 className="text-black font-inter font-bold leading-normal text-5xl">
              Hatch Codes
            </h1>
            <p className="text-blue-500 font-inter font-bold text-3xl pt-6">
              Dynamic QR codes that help you organize and collect your ticket
              sales in one place.
            </p>
            <p className="mt-7">3 minute read</p>
          </div>
        </div>

        <div className="flex flex-col mt-8">
          <h1
            id="overview"
            className="text-black font-inter font-bold leading-normal text-5xl"
          >
            Overview
          </h1>
          <p>
            Ever wanted to ticket your show at the door in a streamlined way
            without causing headache when it's time to payout the band?{" "}
          </p>
          <p>
            Well, HatchCodes are the solution, letting you ticket any show at
            the door without the hassle.
          </p>
        </div>

        <div>
          <h1
            id="hvsv"
            className="text-black font-inter font-bold leading-normal text-5xl mt-8"
          >
            Why HatchCodes?
          </h1>
          <p className="mb-3">
            You might be asking, "Why should I use HatchCodes when I can use
            Venmo?"
          </p>
          <p>
            Venmo is great for moving money between friends, but not ideal for
            ticketing concerts. Here's why customers choose HatchCodes over
            Venmo:
          </p>

          {/* Venmo vs. HatchCode */}
          <h1
            id="dynamic"
            className="text-black font-inter font-bold leading-normal text-5xl mb-8 mt-8"
          >
            HatchCodes vs Venmo
          </h1>

          <div className="mt-5">
            <div className="flex lg:flex-row flex-col justify-center gap-10 comparison-container">
              <div className="flex-1 max-w-lg flex flex-col">
                <img
                  src={Venmo}
                  alt="Venmo Logo"
                  className="block mx-auto w-64 scale-venmo"
                />
                <div className="bg-blue-500 text-white p-4 rounded-t-md"></div>
                <div className="border border-t-0 rounded-b-md p-4 font-bold flex flex-col justify-between ">
                  <ul className="list-disc">
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "red" }}
                      >
                        cancel
                      </span>{" "}
                      Can't track sales on a show-by-show basis
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "red" }}
                      >
                        cancel
                      </span>{" "}
                      Venmo charges a fee of “1.9% + $0.10” per transaction (ie.
                      per ticket sold)
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "red" }}
                      >
                        cancel
                      </span>{" "}
                      Paying out bands requires you to corral bands and collect
                      their Venmo accounts
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "red" }}
                      >
                        cancel
                      </span>{" "}
                      Complicates taxes if you collect more than $600 in a year
                      and don't already have tax information submitted to Venmo
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex-1 max-w-lg flex flex-col">
                <img
                  src={TH}
                  alt="TuneHatch Logo"
                  className="block mx-auto w-64 mb-2"
                />
                <div className="bg-[#E79473] text-white p-4 rounded-t-md"></div>
                <div className="border border-t-0 h-[19rem] rounded-b-md p-4 font-bold flex flex-col justify-between extend-margin">
                  <ul className="list-disc">
                    <li className="flex items-center mb-5">
                      {" "}
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "green" }}
                      >
                        check_circle
                      </span>{" "}
                      Automatically buckets sales for each individual show
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "green" }}
                      >
                        check_circle
                      </span>{" "}
                      Using HatchCodes is free to venues and musicians
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "green" }}
                      >
                        check_circle
                      </span>{" "}
                      Paying out bands is as simple as clicking one button
                    </li>
                    <li className="flex items-center mb-5">
                      <span
                        className="material-symbols-outlined mr-2"
                        style={{ color: "green" }}
                      >
                        check_circle
                      </span>{" "}
                      Taxes made simple - all records (including 1099-K) are
                      handled automatically by our payment processor, Stripe
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col outer-qr-container">
        <div className="ml-5 lg:max-w-[50%] pr-[5rem] dynamic-qr-container">
          <h1
            id="qrcode"
            className="text-black font-inter font-bold leading-normal text-5xl mt-8"
          >
            Dynamic QR Code
          </h1>
          <p className="mb-3">
            HatchCodes automatically update to show a payment page for the
            current event at your venue, saving you the trouble of switching it
            out.{" "}
          </p>
          <p className="mb-3">
            Have 2 or more shows a night? Perfect! HatchCodes will automatically
            update to whichever show is in progress, starting 30 min before the
            show time, to ensure that you never have worry about where sales are
            being attributed.
          </p>
          <p>
            Any changes you make ro shows on your TuneHatch dashboard, like
            ticket prices or who's playing, will instantly reflect on your
            HatchCode, no refresh needed.
          </p>
        </div>

        <div className="lg:max-w-[40%]">
          <iframe
            className="video-size lg:mt-8 sm:p-8"
            src="https://www.youtube.com/embed/Sb6D-dMssY0?si=zGwcin02_jXeyYWQ"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="ml-5">
        <div className="max-w-[80%]">
          <h1
            id="faster-line"
            className="text-black font-inter font-bold leading-normal text-5xl mt-8"
          >
            Faster Lines, Secure Tickets
          </h1>
          <p>
            HatchCode checkouts speed up the door process, getting fans into
            your events quicker and with less hassle. Plus, with our exclusive
            ticket verification system, you can trust that every ticket is the
            real deal, which helps keep your venue safe and secure.
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col bucketing-container">
        <div className="ml-5 lg:max-w-[50%] bucketing-container-in lg:p-0 p-3">
          <h1
            id="bucketing"
            className="text-black font-inter font-bold leading-normal text-5xl mt-8"
          >
            "Bucketing" your shows
          </h1>
          <p className="mb-2">
            Other solutions often aggregate tickets into one “bucket” forcing
            you to do the math to separate one show's sales from another's,
            making evaluating how the show did and how much to pay out bands
            more complex than it needs to be.{" "}
          </p>
          <p>
            With HatchCodes, you can rest assured that tickets sold are always
            attributed to the right show, even when you have multiple shows a
            day. Your ticket sales are also always available for you to
            reference, at any time.
          </p>
        </div>
        <div>
          <img
            src={buckets}
            alt="Trends"
            style={{ maxWidth: "20rem", margin: "2rem 2rem 2rem 2rem" }}
          />
        </div>
      </div>

      <div className="ml-5 mr-5">
        <div className="lg:max-w-[80%] lg:p-0 p-3">
          <h1
            id="no-pos"
            className="text-black font-inter font-bold leading-normal text-5xl mt-8"
          >
            No POS System? No Problem
          </h1>
          <p className="mb-3">
            Apple Pay and other digital wallets aren't just a trend; they're the
            new wallet staples, especially for the under-36 crowd. More than
            half of Americans are now using their phones over cards or cash.
            Younger generations, like Gen Z, are leading this shift—many don't
            carry cash or cards these days. They’re using digital wallets for
            everything from a quick coffee to concert tickets.
          </p>
          <p>
            By integrating HatchCodes into your venue, you’re not just keeping
            up with the times—you’re opening your doors to a generation that
            walks lighter and spends faster. Don’t let cash constraints turn
            away a crowd eager to engage and spend; instead, tap into the pulse
            of the cashless revolution.
          </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col implement-container">
        <div className="ml-5 lg:max-w-[50%] implement-in lg:p-0 p-3">
          <h1
            id="hatch-code"
            className="text-black font-inter font-bold leading-normal lg:text-5xl text-3xl mt-8"
          >
            Implementing Hatch Codes
          </h1>
          <p className="mb-3">
            HatchCode implementation is easy! Simply go to your “venue tools” on
            your venue dashboard (on TuneHatch.com), select “HatchCode”,
            download and print. That's all it takes.
          </p>
          <p>
            We recommend that you place your printed HatchCode wherever concert
            goers are used to paying for tickets, such as taped to the front
            window or on a stand beside the front door.
          </p>
        </div>
        <div className="lg:max-w-[40%]">
          <img src={qrcode} alt="qrcode" />
        </div>
        <div>
          <h1 className="text-black font-inter font-bold leading-normal text-2xl mt-12"></h1>
        </div>
      </div>
      <div className="mt-5 bg-[#1C2E95] flex flex-row items-center justify-between rounded-lg sm:mb-52 md:mb-2 lg:mb-2 ml-4 mr-4">
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
  );
}
