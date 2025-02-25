import React from "react";
import VideoItem from "./VideoItem";
import CardCarousel from "./Carousel/Carousel";
import "react-multi-carousel/lib/styles.css";

interface ChildProps{
  color?: string;
  image?: string;
  text?: string;
  black?: boolean;
}

interface CProps{
  children?: React.ReactNode;
}

const CarousalChildWithCapStickContainer = (props: CProps) => {
  return (
    <div className="w-full h-full rounded-md flex justify-center items-center flex-col">
      {props.children}
    </div>
  );
};

const CarousalChild = (props: ChildProps) => {
  return (
    <div
      style={{ backgroundColor: `#${props.color}` }}
      className="w-full h-full rounded-md flex justify-center items-center flex-col p-3"
    >
      <div className="flex-1">
        <img className="w-full h-full object-cover" src={props.image} alt="" />
      </div>
      <p
        className={`${
          props.black ? "text-black" : "text-white"
        } font-normal text-md text-center`}
      >
        {props.text}
      </p>
    </div>
  );
};




export default function ProductInformation() {
  const texts=["TuneHatch makes creating a show with a ticket listing hassle-free. In just a few minutes you can add all the details to your show, create or upload your show flyer, and promote your show directly on social media to start selling tickets!",
  "Connect with fans online and sell tickets from day one directly through TuneHatch. With your ticket listing ready, you can automatically share your show across Instagram, Facebook, and other social media all at once in just a few easy clicks.",
"TuneHatch puts an end to frustrating website updates by automatically updating your website’s show calendar with all of your public shows including flyers and direct links to buying tickets. Choose from different simple and stylish calendar views, embed your public show calendar, and never worry about updating shows on your website again.",
"TuneHatch reduces your day-to-day stress with an interactive calendar view where you can reschedule your shows and access features to manage each aspect of your show on one simple dashboard.",
"Track your ticket sales for every show and access ticket holder information to stay more informed on your venue’s audience. On the day of the show, you can manage a guest list of your ticket holders and view how ticket sales will contribute to each part of your venue’s payment agreement.",
"HatchCodes provide customers with a QR code to pay for online tickets at the door and keep your ticket revenue all in one place. Your venue’s HatchCode will automatically update for the next show so you don’t have to worry about organizing your ticket sales after the fact.",
"Paying out artists after a show has never been easier. As ticket sales come in they’ll be automatically split for each artist and promoter as a part of your payment agreement. If necessary, you can edit ticket splits after a show to cover your production fees, but when you’re ready to send payments all you need to do is click a button.",
"TuneHatch makes it clean and simple when finding and booking talent. You can post a gig or review in-depth artists’ submissions to book a show. Once the terms are agreed upon, you can post your show with a live ticket listing in just a few minutes.",
"We understand that things can change for an artist or venue very quickly. With TuneHatch you can manage and edit your artist lineup while automatically notifying ticket holders. If you need to fill a spot in your lineup last minute, we make it easy to source great talent at any time before your show."]

  return (
    <div>
      <div className="flex flex-row justify-center mb-3">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/UVOORMhrflI?si=p2SUpu7sU7ct0q-M" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
      </div>
      <div className="flex flex-row justify-center gap-4 pt-6 pb-10">
            {/* <button className="bg-[#CCCCCC] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-100 transition-colors">
                <a href="https://tunehatch.com/register">Sign Up</a> 
            </button> */}
            <button className="bg-[#0F728F] text-white font-bold py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors">
                <a href="https://calendly.com/nathan-tunehatch/30min">Book a Demo</a>
            </button>
        </div>

        <div className="col-span-5 sm:col-span-5 md:col-span-3 lg:col-span-3 xl:col-span-3 rounded-lg my-4 bg-slate-500">
        <CardCarousel />
</div>

      <div className="bg-[#FBE9E4]">
        <h1 className="text-[2rem] font-black p-2 pt-8 text-center mb-5">Learn More About Our Features</h1>
        <VideoItem title="List a Show" description={texts[0]} videosrc="https://www.youtube.com/embed/ywRbdwNTxHw?si=-mQPK_fAPTKUIKnr" bgColor="#3A3A3A" />
        {/* <VideoItem title="Auto-Share to Social Media" description={texts[1]} videosrc="https://www.youtube.com/embed/UVOORMhrflI?si=p2SUpu7sU7ct0q-M" bgColor="#EFB060" /> */}
        <VideoItem title="Auto-Update Your Website" description={texts[2]} videosrc="https://www.youtube.com/embed/O7lWdWnVCa8?si=mpc7h4ihk-n5jXUg" bgColor="#2382BF" />
        <VideoItem title="Manage Calendar" description={texts[3]} videosrc="https://www.youtube.com/embed/GelbfSSqX-M?si=n4d-oP0LIk-odX5n" bgColor="#2382BF" />
        <VideoItem title="Monitor Ticket Sales" description={texts[4]} videosrc="https://www.youtube.com/embed/uf8hCZlI978?si=lIM3yGS7UiYxga53" bgColor="#2382BF" />
        <VideoItem title="Sell Tickets at the Door" description={texts[5]} videosrc="https://www.youtube.com/embed/Sb6D-dMssY0?si=O1tMbzWsbI2Yh9oh" bgColor="#EFB060" />
        <VideoItem title="Pay Out Artists" description={texts[6]} videosrc="https://www.youtube.com/embed/Fh0NFm4Sh0U?si=A428hmyrYNmd8Dnz" bgColor="#EFB060" />
        <VideoItem title="Source Talent" description={texts[7]} videosrc="https://www.youtube.com/embed/wEIST94JBuw?si=NSjFd-QPr30BAcAS" bgColor="#EFB060" />
        <VideoItem title="Manage Lineup" description={texts[8]} videosrc="https://www.youtube.com/embed/RV1kBS50sKs?si=PxLLUommEC7NkgKh" bgColor="#EFB060" />

      </div>
    </div>
  );
}