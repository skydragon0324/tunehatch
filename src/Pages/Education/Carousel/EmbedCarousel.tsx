import React, { ReactNode } from 'react';
import Carousel from 'react-multi-carousel';
import Embed1 from '../../../Images/Education/embed-5spot.png';
import Embed2 from '../../../Images/Education/embed-kimbros.png';
import Embed3 from '../../../Images/Education/embed-mockingbird.png';


interface ImgProps{
  color?: string;
  image?: string;
  index?: number;
}

const ImgContainer = (props: ImgProps) => {
  return (
    <div className="flex flex-col col-span-6 sm:col-span-6 md:col-span-2 lg:col-span-2 xl:col-span-2 px-4 py-2 rounded-lg my-2">
      <div className="items-center my-4 flex-wrap justify-center">
        <div className="max-w-5xl ml-auto mr-auto flex justify-center items-center">
          <img
            className="text-white font-semibold"
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
      autoPlaySpeed={3000}
      keyBoardControl={true}
      transitionDuration={500}
      renderButtonGroupOutside={true}
      containerClass="carousel-container"
      dotListClass="custom-dot-list-style"
    >
      <ImgContainer image={Embed1} color="3A3A3A" index={1} />
      <ImgContainer image={Embed2} color="F9B75D" index={2} />
      <ImgContainer image={Embed3} color="110D24" index={3} />
    </Carousel>
  );
};
