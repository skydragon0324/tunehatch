import AfterRain from "../Images/Flyers/V2/AfterRain.jpg";
import BlackStripe from "../Images/Flyers/V2/BlackStripe.jpg";
import Borealis from "../Images/Flyers/V2/Borealis.jpg";
import BorealisStripe from "../Images/Flyers/V2/BorealisStripe.jpg";
import HazeStripe from "../Images/Flyers/V2/HazeStripe.jpg";
import MidnightLights from "../Images/Flyers/V2/MidnightLights.jpg";
import OceanBreeze from "../Images/Flyers/V2/OceanBreeze.jpg";
import Ocean from "../Images/Flyers/V2/Ocean.jpg";
import RedStripe from "../Images/Flyers/V2/RedStripe.jpg";
import Spotlight from "../Images/Flyers/V2/Spotlight.jpg";
import SpotlightStripe from "../Images/Flyers/V2/SpotlightStripe.jpg";
import Sunset from "../Images/Flyers/V2/Sunset.jpg";

/*
Default Flyer Options
Requires: 
- Image Path OR Image Source OR Width and Height, if no image
- orientation
Optional:
- Background Color
- Font Color
- Default Font
- Safe Percentage
    * This indicates the extra percentage from the top text objects should have to accomodate for margins & bleed
*/

export type KeyofThFlyerAspectRatios = "square" | "portrait" | "landscape";
export type KeyofThFlyerFontIndex = "Modern" | "Bold" | "Sleek";
export type KeyofTHFlierTemplates = number;

const TH_FLYER_ASPECT_RATIOS = {
  square: {
    xScale: 1,
    yScale: 1,
    fontScale: {
      title: 0.95,
      subtitle: 0.9,
      text: 1,
    },
  },
  portrait: {
    xScale: 0.5625,
    yScale: 1,
    fontScale: {
      title: 0.8,
      subtitle: 0.4,
      text: 1,
    },
  },
  landscape: {
    xScale: 1,
    yScale: 0.666,
    fontScale: {
      title: 0.9,
      subtitle: 0.7,
      text: 1,
    },
  },
};
const TH_FLYER_FONT_INDEX = {
  Modern: {
    family: "Inter",
    scale: 1,
    label: "Modern",
    title: {
      weight: 900,
    },
    subtitle: {
      weight: 600,
    },
    text: {},
  },
  Bold: {
    family: "Anton",
    label: "Bold",
    scale: 0.95,
    title: {
      weight: 900,
    },
    subtitle: {
      weight: 600,
    },
    text: {},
  },
  Sleek: {
    family: "Josefin Sans",
    label: "Sleek",
    scale: 1.01,
    padding: "3px 0 0 0",
    title: {
      weight: 400,
    },
    subtitle: {
      weight: 400,
    },
    text: {},
  },
};

const TH_FLYER_TEMPLATES= [
  {
    name: "Spotlight Stripe",
    orientation: "square",
    src: SpotlightStripe,
    fontColor: "black",
    font: "Modern",
    safeBottom: 25,
  },
  {
    name: "Borealis Stripe",
    orientation: "square",
    src: BorealisStripe,
    fontColor: "black",
    font: "Modern",
    safeBottom: 25,
  },
  {
    name: "Red Stripe",
    orientation: "square",
    src: RedStripe,
    fontColor: "black",
    font: "Modern",
    safeBottom: 25,
  },
  {
    name: "Black Stripe",
    orientation: "square",
    src: BlackStripe,
    fontColor: "black",
    font: "Modern",
    safeBottom: 25,
  },
  {
    name: "Haze Stripe",
    orientation: "square",
    src: HazeStripe,
    fontColor: "black",
    font: "Modern",
    safeBottom: 25,
  },
  {
    name: "After Rain",
    orientation: "square",
    src: AfterRain,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Borealis",
    orientation: "square",
    src: Borealis,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Midnight Lights",
    orientation: "square",
    src: MidnightLights,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Ocean",
    orientation: "square",
    src: Ocean,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Ocean Breeze",
    orientation: "square",
    src: OceanBreeze,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Spotlight",
    orientation: "square",
    src: Spotlight,
    fontColor: "white",
    font: "Modern",
  },
  {
    name: "Sunset",
    orientation: "square",
    src: Sunset,
    fontColor: "white",
    font: "Modern",
  },
];

export { TH_FLYER_TEMPLATES, TH_FLYER_FONT_INDEX, TH_FLYER_ASPECT_RATIOS };
