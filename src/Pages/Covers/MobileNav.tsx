import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { openCover } from "../../Redux/UI/UISlice";

interface Props {
  links: { [key: string]: { label?: string | React.ReactNode } };
}

export default function MobileNav({ links }: Props) {
  const dispatch = useAppDispatch();
  return (
    <div className="min-h-full min-w-full flex flex-col flex-grow justify-center items-center gap-2">
      {Object.keys(links).map((link, i) => {
        return (
          <Link
            onClick={() => dispatch(openCover({ status: false }))}
            className="flex"
            key={`mnavlinks/${i}`}
            to={link}
          >
            <h1 className="text-4xl font-black">{links[link].label}</h1>
          </Link>
        );
      })}
    </div>
  );
}
