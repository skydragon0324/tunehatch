import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import TextLogo from "../../../Images/TextLogo.png";
import Img from "../../Images/Img";
import NavDropdown from "./NavDropdown";
import { getNavLinks } from "../../../Helpers/HelperFunctions";
import { Link } from "react-router-dom";
import { resetUI } from "../../../Redux/UI/UISlice";
// import IconButton from "../../Buttons/IconButton";
import NotificationCenter from "../../NotificationCenter";
import { useGetMessagesQuery } from "../../../Redux/API/IndustryAPI";

/**
 * Disappears when Grid's `fullscreen` state is set to true.
 */
export default function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const alerts = useAppSelector((state) => state.user.notifications);
  const messagesQuery = useGetMessagesQuery({SECRET_UID: user.uid}, {skip: !user.uid});
  const messages = messagesQuery?.data
  console.log(messages)
  const [navLinks, setNavLinks] = useState({});
  useEffect(() => {
    setNavLinks(
      getNavLinks(
        user.displayUID ? true : false,
        user.artist,
        user.host,
        user.showrunner,
      ),
    );
  }, [user]);
  return (
    <div className="flex flex-row min-w-full p-4 overflow-visible">
      <div className="flex flex-grow whitespace-nowrap">
        <Link onClick={() => dispatch(resetUI())} to={"/"}>
          <Img localSrc={TextLogo} className="h-8 inline" />
        </Link>
      </div>
      <div className="hidden text-lg sm:flex sm:flex-grow sm:flex-row sm:gap-6 sm:place-items-center sm:justify-end pr-5">
        <Link onClick={() => dispatch(resetUI())} to={"/apply"}>
          APPLY
        </Link>
        <Link onClick={() => dispatch(resetUI())} to={"/shows"}>
          SHOWS
        </Link>
        <Link onClick={() => dispatch(resetUI())} to={"/artists"}>
          ARTISTS
        </Link>
        <Link onClick={() => dispatch(resetUI())} to={"/resources"}>
          RESOURCES
        </Link>
      </div>
      <div className="flex gap-5 justify-end overflow-visible">
        {/* <IconButton icon="notifications" className="fill-black" onClick={() => { console.log(alerts); */}
        {/* }}></IconButton> */}
        {user.uid && (
          <div className="flex items-center">
            <NotificationCenter notifications={alerts} />
          </div>
        )}
        <NavDropdown links={navLinks} />
      </div>
    </div>
  );
}
