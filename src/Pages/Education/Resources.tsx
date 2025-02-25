import React from "react";
import { Link } from "react-router-dom";
import Education from "../../Images/Education/hatchbg-sm.png";
import Footer from "../../Components/Footer";

interface CardProps {
  title: string;
  description: string;
  to: string;
}

const CardComponent: React.FC<CardProps> = ({ title, description, to }) => {
  return (
    <div className="flex flex-col pt-3 pl-1">
      <Link
        to={to}
        className="transition duration-200 ease-in-out hover:bg-gray-200"
      >
        <p className="text-[1.4rem] font-semibold">{title}</p>
      </Link>

      <p className="text-[1rem] font-semibold mb-3 text-[#747677]">
        {description}
      </p>
    </div>
  );
};

export default function Resources() {
  return (
    <div>
      <div className="flex lg:flex-row flex-col">
        <div className="bg-[#FBF0E8] lg:max-w-[40vw] p-8 ">
          <h1 className="text-[2rem] font-semibold mb-2">Featured</h1>
          <Link to="../hatch-code">
            <img className="max-w-[35vw]" src={Education} alt="Hatch pic" />
          </Link>
          <p className="text-[1.6rem] font-light mb-5 mt-3">
            Optimize Electronic Door Sales with Hatch Codes
          </p>
          <Link
            to="../hatch-code"
            className="text-[#141F68] font-semibold mb-2 text-[1.2rem]"
          >
            Read More ———&gt;{" "}
          </Link>
          <CardComponent
            title="About Us"
            description="Learn about our passionate team"
            to="../about"
          />
          <div className="flex flex-col pt-3 pl-1">
            <a
              href="mailto:info@tunehatch.com"
              className="transition duration-200 ease-in-out hover:bg-gray-200"
            >
              <p className="text-[1.4rem] font-semibold">Contact Us</p>
            </a>

            <p className="text-[1rem] font-semibold mb-3 text-[#747677]">
              React out at anytime
            </p>
          </div>
        </div>
        <div className="lg:ml-6 lg:max-w-[25vw] lg:p-0 flex flex-col gap-8 p-3 mt-3">
          <h1 className="text-[1.8rem] font-semibold p-1.5 bg-[#141F68] rounded-lg text-white">
            For Artists
          </h1>

          <CardComponent
            title="Why TuneHatch?"
            description="Grow your live audience"
            to="../artist-support"
          />
          <CardComponent
            title="Set Up Your Profile"
            description="Highlight your music and socials "
            to="../artist-support"
          />
          <CardComponent
            title="Payouts"
            description="Receive secure payouts after a show"
            to="../artist-support"
          />
          <CardComponent
            title="Apply to Gigs"
            description="Find opportunities to play"
            to="../apply"
          />
          <CardComponent
            title="Co-Hosting "
            description="Manage the lineup and edit flyers and details of your upcoming shows"
            to="../artist-support"
          />
        </div>
        <div className="lg:ml-6 lg:max-w-[25vw] lg:p-0 flex flex-col gap-8 p-3 mt-3">
          <h1 className="text-[1.8rem] font-semibold p-1.5 bg-[#E79473] rounded-lg text-white">
            For Venues
          </h1>
          <CardComponent
            title="Why TuneHatch?"
            description="Help make your venue operations easier "
            to="../product-information"
          />
          <CardComponent
            title="Set Up Your Website"
            description="Automatically update your website "
            to="../embeds"
          />
          <CardComponent
            title="Payouts"
            description="Securely send payments after a show"
            to="../payouts"
          />
          <CardComponent
            title="Door Sales"
            description="Sell and track tickets at the door"
            to="../hatch-code"
          />
          <CardComponent
            title="Video Walkthroughs "
            description="Learn step-by-step how to use TuneHatch"
            to="../product-information"
          />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
