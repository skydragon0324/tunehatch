import React, { ReactNode } from 'react';
import Carousel from 'react-multi-carousel';
import MV from "../../../Images/Venues/mockingbird.png";
import UV from "../../../Images/Venues/u.png";
import KV from "../../../Images/Venues/kimbros.png";
import TV from "../../../Images/Venues/the-5-spot.png";
import TBV from "../../../Images/Venues/the-bowery-vault.png";
import MUV from "../../../Images/Venues/music-makers-stage.png";


interface ImgProps{
  color?: string;
  image?: string;
  index?: number;
}

const text = ["“I use SquareSpace and struggled to link my website to my ticket links. TuneHatch set up my website in under 30 minutes. Haven't had to update it since.” -- Amanda, The Underdog",
"“My previous ticketing provider made it so difficult to transfer money after a show. With TuneHatch I can split ticket sales directly with artists and into my venue account in just one click.” -- Will, The Mockingbird Theater",
"“I book about 12 shows per week and I have to update my website, facebook, and instagram for every show. TuneHatch allows me to update all of it in one go.” -- Will, Kimbro's Picklin' Parlor",
"“We exclusively used cash at the door for ticket sales until artists started creating their own ticket links. We realized we needed to start offering pre-sale tickets and TuneHatch helped get our process set up.” -- Todd, The 5 Spot",
"“I book about 40 artists a week and it’s difficult to get everyone to send me the info I need. I post open gigs on TuneHatch and artists apply and I just review their profiles and confirm them through the site.” -- Vero, The Bowery Vault",
"“I wanted to post shows somewhere local so people can find them quickly. TuneHatch is a great tool for independent venues because it’s a central location where people can find unique shows.” -- Julie, Music Makers Stage"
]


const ImgContainer = (props: ImgProps) => {
  return (
    <div className="flex flex-col col-span-6 sm:col-span-6 md:col-span-2 lg:col-span-2 xl:col-span-2 px-4 py-2 rounded-lg my-2">
      <div className="items-center my-4 flex-wrap justify-center">
        <div className='w-[50%] ml-auto mr-auto'>
          <p className="text-white font-medium text-center mb-5">
              {text[props.index-1]}
          </p>
        </div>
        <div className="ml-auto mr-auto w-[5rem] bg-[#6082B6] rounded-full flex justify-center items-center">
          <img
            className="text-white font-semibold  rounded-full"
            src={props.image}
            alt="venue picture"
          />
        </div>
      </div>
      
    </div>
  );
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export default function CardCarousal(){
  return (
    <Carousel
      swipeable={true}
      draggable={false}
      showDots={true}
      arrows={true}
      responsive={responsive}
      ssr={true}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={8000}
      keyBoardControl={true}
      transitionDuration={500}
      renderButtonGroupOutside={true}
      containerClass="carousel-container"
      dotListClass="custom-dot-list-style"
    >
      <ImgContainer image={UV} color="3A3A3A" index={1} />
      <ImgContainer image={MV} color="F9B75D" index={2} />
      <ImgContainer image={KV} color="110D24" index={3} />
      <ImgContainer image={TV} color="110D24" index={4} />
      <ImgContainer image={TBV} color="110D24" index={5} />
      <ImgContainer image={MUV} color="110D24" index={6} />
    </Carousel>
  );
};
