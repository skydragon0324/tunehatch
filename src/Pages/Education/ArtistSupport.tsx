import React from "react";
import Support from "../../Images/Education/support.png";
import Support1 from "../../Images/Education/suppor1.png";
import Support2 from "../../Images/Education/support2.png";
import Support3 from "../../Images/Education/support3.png";
import Support4 from "../../Images/Education/manage_payouts.png";

export default function ArtistSupport() {
  return (
    <div>
      <div className="flex lg:flex-row flex-col whole-margin">
        <div className="flex lg:flex-col flex-row items-start lg:bg-[#D8A152]">
          <div className="lg:justify-between p-6 space-y-4">
            <h2 className="lg:text-white font-inter font-bold text-[3rem] mt-6">
              Artist Support
            </h2>
            <p className="lg:text-white font-inter font-bold text-3xl pt-6">
              Find gigs, promote your shows, and grow your audience without all
              the red-tape!
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
          className="lg:w-[60vw] lg:ml-auto lg:max-w-[800px] p-12"
          src={Support}
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
                <a href="#hvsv">Set Up Your Profile</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#poa">Receiving Payouts</a>
              </p>
              <p className="mb-3 leading-none">
                <a href="#poyv">Applying to Gigs</a>
              </p>
            </div>
          </div>

          <div className="ml-8 hatch-title lg:w-[55vw]">
            <h1 className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] lg:pb-5">
              Why TuneHatch?
            </h1>
            <p className="font-inter font-bold text-lg">
              We created TuneHatch because finding, booking, and ticketing shows
              for independent artists can be a long, difficult, and confusing
              process. We want to make each step easier and give artist the
              tools they need to put on amazing live shows and grow their
              fanbase. We also aim to provide artists with as much transparency
              as possible to empower their decisions and help maximize their
              earnings.
            </p>
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

          <div className="mt-9">
            <iframe
              className="video-size sm:p-8"
              src="https://www.youtube.com/embed/UdzWLhv4ZUg?si=N2mio1sF7buHJv_T"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[60%] pr-[5rem] dynamic-qr-container">
            <h1
              id="hvsv"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Set Up Your Profile
            </h1>
            <p className="mb-3">
              {" "}
              To start, go to our “Login” page and click “Sign Up”. You’ll be
              asked to enter your name and a valid email to get started. Once
              signed up click on the profile icon in the top right corner and
              click “Profile”. Now you can customize your profile page. Select
              “Edit Profile” and click on “Artist” to toggle on your Artist
              Page. With this toggled on, you can write a bio and add links to
              embed you favorite social media pages.
            </p>
          </div>
          <div className="lg:max-w-[40%]">
            <img
              className="w-[60%] h-auto"
              src={Support1}
              alt="A picture of payout"
            />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[60%] pr-[2rem] dynamic-qr-container">
            <h1
              id="poa"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Receive Secure Payouts
            </h1>
            <p className="mb-3">
              {" "}
              TuneHatch makes it easy and transparent to receive your payments
              from live shows. Set up your account to receive payments by going
              to your profile page and selecting “Manage Payouts”. This will
              take you to the Stripe portal where you can register as a business
              or individual to receive payouts.
            </p>
            <p className="mb-3">
              All payouts are processed through our secure payments processor,
              Stripe. Personal, banking, and card information are not accessible
              to TuneHatch or visible to anyone else. Your personal payment
              information is only visible to you!
            </p>
            <p className="mb-3">
              Stripe also handles 1099K’s, so you don’t have to.{" "}
            </p>
          </div>
          <div className="lg:max-w-[40%] mt-8">
            <img src={Support4} alt="A picture of support" />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col outer-qr-container">
          <div className="ml-5 lg:max-w-[80%] pr-[5rem] dynamic-qr-container">
            <h1
              id="poyv"
              className="text-black font-inter font-bold lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Tracking Payouts and Ticket Sales{" "}
            </h1>

            <p className="mb-3">
              {" "}
              As an artists you can always track your live ticket sales and view
              your estimated payout for each show. To view live ticket sales
              click on your profile icon and click on “Manage Shows”. Scroll to
              the show and click “Manage”. Here you’ll be able to see all the
              details on the number of tickets sold and the estimated payout
              based on your performance agreement. After a show, the venue just
              needs to double-check the payouts and click send which will send
              the payout directly to your secure Stripe account.{" "}
            </p>
            <p className="mb-3">
              (Note: the estimated payout may be subject to change if a venue
              needs to fulfill their production fees or if there’s a change to
              the lineup, but all parties will be notified of any changes made
              to the payout.)
            </p>
          </div>
          <div className="lg:max-w-[20%]">
            {/* <img
              className="lg:scale-150"
              src={Support3}
              alt="A picture of support"
            /> */}
          </div>
        </div>

        <div className="ml-5">
          <div className="lg:max-w-[80%]">
            <h1
              id="pona"
              className="text-black font-inter font-bold leading-normal lg:text-5xl text-[2.4rem] mt-8 mb-3"
            >
              Apply to Gigs{" "}
            </h1>
            <p className="mb-3">
              Finding new venues to play in front of a live audience has never
              been easier! Click on the “Find Gigs” page to search through a
              range of great, trusted venues. You can filter your search of
              venues by capacity, date, and payment and when you find one you
              like just click apply.{" "}
            </p>
            <p className="mb-3">
              Before you submit your application review the show details and
              determine if the performance agreement is suitable for you. Toggle
              on each agreement criteria to be able to send your application,
              then click send. The venue will be notified of your new
              application and can review your profile and social media to see if
              you are the right fit.{" "}
            </p>
            <p className="mb-3">
              When you’re accepted you will get an email notification that
              you’re added to the show and it will appear under “Artist Shows”
              when you click on your profile icon.{" "}
            </p>
          </div>
        </div>

        <div className="bg-[#D8A152] flex flex-row items-center justify-between rounded-lg sm:mb-52 md:mb-2 lg:mb-2 ml-4 mr-4">
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
