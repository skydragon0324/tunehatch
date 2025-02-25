import React from "react";
import BannerImage from "../Components/Images/BannerImage";
import Footer from "../Components/Footer";
import FAQ from "./FAQ";
import Img from "../Components/Images/Img";
import AboutBackground from "../Images/Backgrounds/about-background.jpg";
import TuneHatchFounders from "../Images/About Us/tunehatch-founders.png";
import SingerPic1 from "../Images/About Us/singerpic1.png";
import SingerPic2 from "../Images/About Us/singerpic2.png";
import TargetCardCollection from "../Components/Collections/TargetCardCollection";
import { useAppSelector } from "../hooks";
// import venue1 from "../Images/Venues/3-lounge.png"
// import venue2 from "../Images/Venues/emerson-hall.png";
// import venue3 from "../Images/Venues/fat-bottom-browing.png";
// import venue4 from "../Images/Venues/music-makers-stage.png";
// import venue5 from "../Images/Venues/springwater-club-lounge.png";
// import venue6 from "../Images/Venues/sylvan-supply.png";
// import venue7 from "../Images/Venues/teddys-tavern.png";
// import venue8 from "../Images/Venues/the-5-spot.png";
// import venue9 from "../Images/Venues/the-bowery-vault.png";
// import venue10 from "../Images/Venues/Sun.png";
// import venue11 from "../Images/Venues/acme.png";
// import venue12 from "../Images/Venues/u.png";
// import venue13 from "../Images/Venues/kimbros.png";
// import venue14 from "../Images/Venues/mockingbird.png"

export default function About() {
  const user = useAppSelector((state) => state.user.data);

  const bannerText = "Creating community through the love of music.";
  const ourStoryText =
    "Founded by two Vanderbilt MBAs and their Tech Whiz friend, TuneHatch was created because we saw how hard and time consuming it was for music venues and artists to book, promote, and ticket shows. With so many moving pieces, last minute changes, and countless emails (*sigh*), despite best efforts, things sometimes fall through the cracks. \n Honestly, it's a lot of work! So, we set out to make it easier.";
  const whatWeDoText =
    "In a nutshell, we empower music venues and artists to manage their shows, all in one place, and fans to find local shows that fit their unique tastes. From booking to ticketing and everything in between, you can do it on TuneHatch faster and easier than anywhere else.";
  const ourMissionText =
    "Our goal is to make live music more transparent, efficient, and profitable (for the venues and the artists) without losing the community touch that makes these experiences warm and memorable.";
  return (
    <div className="items-center text-center">
      <BannerImage src={AboutBackground} />
      <h1 className="text-4xl font-extrabold p-5">{bannerText}</h1>
      <div className="bg-red-50 p-5">
        <h2 className="text-2xl font-black ">Our Story</h2>
        <p className="p-6">{ourStoryText}</p>
        <Img src={TuneHatchFounders} className="rounded" />
        <figcaption>Christal, Nathan, and Reece (he works remote)</figcaption>
      </div>
      <div className="bg-white p-5">
        <h2 className="text-2xl font-black text-amber-400">What We Do</h2>
        <p className="p-2">{whatWeDoText}</p>
        <Img src={SingerPic1} className="mx-auto" />
      </div>
      <div className="bg-white p-5">
        <h2 className="text-2xl font-black text-sky-400">Our Mission</h2>
        <p className="p-2">{ourMissionText}</p>
        <Img src={SingerPic2} className="mx-auto" />
      </div>
      <div className="bg-white">
        <h2 className="text-3xl font-black ">Meet Our Team</h2>
        <h5>These are the people who made TuneHatch</h5>
        <TargetCardCollection
          type="artist"
          ids={[
            "10201558",
            "81145",
            "1923",
            "4553109",
            "11915247",
            "15509543",
            "4384315",
          ]}
        />
      </div>
      <div className="bg-white">
        <h2 className="text-3xl font-black ">Discover Our Venue Ambassadors</h2>
        <h5>
          These venues give us great feedback that we use to make booking,
          managing, and promoting shows seamless.
        </h5>
        <TargetCardCollection
          type="venue"
          ids={[
            "17857582",
            "10201558",
            "45056",
            "282507",
            "3060099",
            "15982909",
            "14759623",
          ]}
        />
      </div>
      <div className="bg-white">
        <h2 className="text-3xl font-black ">
          Listen To Our Artist Ambassadors
        </h2>
        <h5>
          These are the people that helped us build our brand and extend our
          community.
        </h5>
        <TargetCardCollection
          type="artist"
          ids={[
            "10201558",
            "1439714",
            "4164",
            "3966",
            "5037676",
            "5037669",
            "5037670",
            "3510412",
            "5504231",
            "11768615",
          ]}
        />
      </div>
      <div className="bg-amber-400">
        <h2 className="text-white text-3xl font-black pt-4 pb-4 p-2">
          Trusted by Your Favorite Local Stages
        </h2>
        {/* <div className="flex flex-wrap ">
        <a href="https://tunehatch.com/venues/10316259"><Img className="" src={venue2} alt="emerson-hall" /></a>
        <a href="https://tunehatch.com/venues/11570093"><Img className="" src={venue3} alt="fat-bottom-brewing" /></a>
        <a href="https://tunehatch.com/venues/4828362"><Img className="" src={venue1} alt="3-lounge" /></a>
        <a href="https://tunehatch.com/venues/282507"><Img className="" src={venue4} alt="music-maker-stage" /></a>
        <a href="https://tunehatch.com/venues/99230"><Img className="" src={venue5} alt="the-springwater-club" /></a>
        <a href="https://tunehatch.com/venues/4613185"><Img className="" src={venue6} alt="sylvan-supply" /></a>
        <a href="https://tunehatch.com/venues/10208181"><Img className="" src={venue7} alt="teddys-tavern" /></a>
        <a href="https://tunehatch.com/venues/45056"><Img className="" src={venue8} alt="the-5-spot" /></a>
        <a href="https://tunehatch.com/venues/3060099"><Img className="" src={venue9} alt="the-bowery-vault" /></a>
        <a href="https://tunehatch.com/venues/12778381"><Img className="" src={venue10} alt="cafe-coco" /></a>
        <a href="https://tunehatch.com/venues/12779759"><Img className="" src={venue11} alt="acme" /></a>
        <a href="https://tunehatch.com/venues/12778804"><Img className="" src={venue12} alt="the-bowery-vault" /></a>
        <a href="https://tunehatch.com/venues/15982909"><Img className="" src={venue13} alt="Kimbros" /></a>
        <a href="https://tunehatch.com/venues/14759623"><Img className="" src={venue14} alt="Mockingbird" /></a>

      </div> */}
        <h2 className="text-white text-3xl font-black pt-4 pb-4 p-2">
          ...and the Most Dynamic Showrunners
        </h2>
      </div>
      <div className="bg-white p-4">
        <h2 className="text-3xl font-black ">...and</h2>
        <p className="text-6xl font-black text-amber-500"> 1050+ </p>
        <h2 className="text-3xl font-black ">independent musicians</h2>
        {/* Collection of artists here */}
      </div>
      <div className="bg-red-50">
        <FAQ />
      </div>

      <div className="bg-white">
        <h2 className="text-2xl p-2 mt-4 font-black ">
          We hope that covers everything. If not, we're always happy to hear
          from a fan (or artist. or venue. or showrunner.)
        </h2>
        <p className="text-sm">
          {!user.uid ? (
            <>
              <a className="text-blue-400" href="/register">
                sign up
              </a>{" "}
              or{" "}
              <a className="text-blue-400" href="mailto:info@tunehatch.com">
                reach out
              </a>
            </>
          ) : (
            <a className="text-blue-400" href="mailto:info@tunehatch.com">
              Reach out
            </a>
          )}
        </p>
      </div>
      <Footer />
    </div>
  );
}
