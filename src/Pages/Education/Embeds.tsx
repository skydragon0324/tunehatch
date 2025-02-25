import React from "react";
import Embed from "../../Images/Education/embed.png";

import EmbedCarosal from "./Carousel/EmbedCarousel";
import "react-multi-carousel/lib/styles.css";

export default function Embeds() {
  return (
    <div>
      <div className="flex lg:flex-row flex-col whole-margin">
        <div className="flex lg:flex-col flex-row items-start lg:bg-[#2F3640]">
          <div className="lg:justify-between p-6 space-y-4">
            <h2 className="lg:text-white font-inter font-bold text-[3rem] mt-6">
              Embeds
            </h2>
            <p className="lg:text-white font-inter font-bold text-3xl pt-6">
              Effortlessly Update Your Website
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button className="bg-[#CCCCCC] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-100 transition-colors">
                            <a href="https://tunehatch.com/register">Sign Up</a> 
                        </button>
                        <button className="bg-[#0F728F] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors">
                            <a href="https://calendly.com/nathan-tunehatch/30min">Book a Demo</a>
                        </button>
                    </div> */}
          </div>
        </div>
        <img
          className="lg:w-[60vw] lg:ml-auto lg:max-w-[800px]"
          src={Embed}
          alt="Support"
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
                <a href="#hvsv">Beautiful Listings, Everytime</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#poa">How to Set Up</a>
              </p>
            </div>
          </div>

          <div className="ml-8 hatch-title lg:w-[55vw]">
            <h1 className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] lg:pb-5">
              Stop manually updating your website!
            </h1>
            <p className="font-inter font-bold text-lg">
              Through TuneHatch, when you book or list a show, your venue’s
              website will automatically update, so you don’t have to do it.{" "}
            </p>
          </div>
        </div>

        <div className="gradient-background mt-8">
          <EmbedCarosal />
          <div className="text-white font-bold flex justify-center pb-5">
            Our venue assistants are available 24/7 to help you book, promote,
            and ticket your shows through TuneHatch!
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[50%] pr-[5rem] dynamic-qr-container">
            <h1
              id="qrcode"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Overview
            </h1>
            <p className="mb-3">
              TuneHatch serves at the crossroads of a music social media
              platform and tools-driven resource to help artists and teams with
              each step of their live show process.{" "}
            </p>
            <p className="mb-3">
              First, customize your profile to give fans and venues a sense of
              who you are as an artist. Finish setting up your profile by
              linking your account with Stripe to receive secure payouts from
              your live ticket sales. Now you’re ready to apply to gigs! Check
              out our “Find Gigs” page to find venues looking to book shows.
              When you apply to a venue you can see all their criteria, details,
              and payment agreements up front!{" "}
            </p>
          </div>

          <div className="mt-5">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/O7lWdWnVCa8?si=u7ts1cg0MIoduxfD"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="ml-5">
          <div className="lg:max-w-[80%]">
            <h1
              id="hvsv"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Beautiful Listings, Every Time
            </h1>
            <p className="mb-3">
              {" "}
              Our embeds update your website with the beautiful listings you
              generate through TuneHatch, so all your show information, plus
              graphics like flyers, are added to the embeds, keeping your
              website looking great!{" "}
            </p>
          </div>
        </div>

        <div className="ml-5">
          <div className="lg:max-w-[80%]">
            <h1
              id="poa"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              How to Set Up
            </h1>
            <p>Embed set up takes 4 easy steps:</p>
            <ul>
              <li>
                1. Go to your “venue tools” on your venue dashboard (on
                TuneHatch.com)
              </li>
              <li>2. Select “Embed Center”</li>
              <li>3. Choose your preferred embed design</li>
              <li>4. Select the HTML and add it to your website</li>
            </ul>
          </div>
          <p className="mt-3 mb-3">
            {" "}
            Need help? Our team is happy to implement the embeds directly to
            your site for you! Send us a request at “info@tunehatch.com” and
            we’ll have our support team get your embeds up within 24 hours.{" "}
          </p>
        </div>
      </div>
      <div className="bg-[#2F3640] flex flex-row items-center justify-between rounded-lg sm:mb-52 md:mb-2 lg:mb-2 ml-4 mr-4">
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
