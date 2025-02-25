import React, { useEffect } from "react";
import Grid from "./Components/Layout/Grid";
import Shows from "./Pages/Shows";
import Register from "./Pages/Register";
import Artists from "./Pages/Artists";
import Login from "./Pages/Login";
import { getCookie } from "./Helpers/HelperFunctions";
import { useCookieLogInMutation } from "./Redux/API/PublicAPI";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useParams,
} from "react-router-dom";
import { useAppSelector } from "./hooks";
import Landing from "./Pages/Landing";
import Profile from "./Pages/Profile/ProfileWrapper";
import ManageVenues from "./Pages/ManageVenues";
import ManageVenue from "./Pages/ManageVenue";
import ShowDetails from "./Pages/ShowDetails";
import Playground from "./Pages/Playground";
import About from "./Pages/About";
import Logout from "./Pages/Logout";
import LegacyRedirect from "./Pages/Profile/LegacyRedirect";
import Apply from "./Pages/Apply";
import ArtistShows from "./Pages/ArtistShows";
import TicketDashboard from "./Pages/TicketsDashboard";
import ManageShowrunners from "./Pages/ManageShowrunners";
import ManageShowrunner from "./Pages/ManageShowrunnerGroup";
import Hatchcode from "./Pages/Hatchcode/Hatchcode";
import UpcomingShowsEmbed from "./Pages/Embeds/UpcomingShows";
// import { useGetNotificationsQuery } from "./Redux/API/UserAPI";
import ShowCalendarEmbed from "./Pages/Embeds/ShowCalendar";
import VenueGuestList from "./Tools/Venue/VenueGuestList";
import MessageCenter from "./Pages/MessageCenter";
import NavigateWithParams from "./Helpers/NavigateWithParams";
import TicketScanner from "./Pages/TicketScanner";
import QuickConfirm from "./Pages/QuickConfirm";
import TOS from "./Documents/TOS";
import Refunds from "./Documents/Refunds";
import Privacy from "./Documents/Privacy";
import ResetPassword from "./Pages/ResetPassword";
import ProductInformation from "./Pages/Education/ProductInformation";
import PayOuts from "./Pages/Education/PayOuts";
import HatchCode from "./Pages/HatchCode";
import ArtistSupport from "./Pages/Education/ArtistSupport";
import Embeds from "./Pages/Education/Embeds";
import Resources from "./Pages/Education/Resources";

function AppControl() {
  const SECRET_UID = getCookie("SECRET_UID");
  // const dispatch = useAppDispatch();
  const [verifyUser] = useCookieLogInMutation();
  const user = useAppSelector((state) => state.user.data);
  // const venueList = useAppSelector((state) => state.user.data.venues);
  // const notifications = useGetNotificationsQuery(
  //   { SECRET_UID: user.uid, venuesList: venueList },
  //   { skip: !user.uid }
  // );
  console.log(SECRET_UID);
  useEffect(() => {
    if (SECRET_UID) {
      verifyUser(SECRET_UID);
    }
  }, [SECRET_UID]);

  return (
    <Router>
      <div
        className="hidden bg-sky-400 bg-amber-700 text-amber-700 text-sky-400 text-amber-400 text-blue-600 text-gray-800 text-green-400"
        id="colorInitializer"
      ></div>
      <Grid>
        <Routes>
          <Route path="/playground/:SECRET_UID" element={<Playground />} />

          <Route path="/" element={<Landing />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/profile/:type/:profileID" element={<Profile />} />
          <Route path="/venues/manage/:venueID" element={<ManageVenue />} />
          <Route path="/venues/manage" element={<ManageVenues />} />
          <Route path="/showrunner-tools" element={<ManageShowrunners />} />
          <Route
            path="/showrunner-tools/:SGID"
            element={<ManageShowrunner />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/connectedapistatus" />
          <Route path="/shows" element={<Shows />} />
          <Route path="/shows/:showID" element={<ShowDetails />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/hatch-code" element={<HatchCode />} />
          {
            //legacy redirects start
          }
          <Route path="/venues/:id" element={<LegacyRedirect />} />
          <Route path="/profile/:id" element={<LegacyRedirect />} />
          {
            //legacy redirects end
          }
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/claim/:claimCode" element={<Register />} />
          <Route
            path="/claim/register/:claimCode"
            element={<NavigateWithParams to={`/register/claim/:claimCode`} />}
          />
          {/*
                Offer legacy redirect here
                <Route path="/manage-venues" element={<ManageVenues/>} /> */}
          <Route path="/artist/manage-shows" element={<ArtistShows />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="privacy" element={<Privacy />} />
          <Route path="tos" element={<TOS />} />
          <Route path="payouts" element={<PayOuts />} />
          <Route path="embeds" element={<Embeds />} />
          <Route path="artist-support" element={<ArtistSupport />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="tickets" element={<TicketDashboard />} />
          <Route path="messages" element={<MessageCenter />} />
          <Route path="message/new/:recipientType/:recipientID" element={<MessageCenter/>}/>
          <Route path="/product-information" element={<ProductInformation/>} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/message/:profileID" />
          <Route
            path="/profile"
            element={
              user.displayUID ? (
                <Navigate replace to={"/profile/u/" + user.displayUID} />
              ) : (
                <Navigate replace to={"/login"} />
              )
            }
          />
          <Route path="/mv/:venueID" element={<Hatchcode />} />
          <Route path="/msr/:SRID" element={<Hatchcode />} />
          <Route path="/e/guestlist/:showID" element={<VenueGuestList />} />
          <Route
            path="/e/ts/:venueID/:showID/:ticketID"
            element={<TicketScanner />}
          />

          {/* secretuid directly in path for cookie login when hadnling text msg */}
          <Route path="/qc/:showID" element={<QuickConfirm />} />
          <Route path="/qc/:showID/:SECRET_UID" element={<QuickConfirm />} />
          {/* <Route path="/auth" /> */}
          <Route path="/showrunner-tools" />
          {/* embeds */}
          <Route
            path="/e/upcomingShows/:venueID/:styleOptions"
            element={<UpcomingShowsEmbed />}
          />
          <Route
            path="/e/sr/upcomingShows/:SRID/:styleOptions"
            element={<UpcomingShowsEmbed />}
          />
          <Route
            path="/e/showCalendar/:venueID/:styleOptions"
            element={<ShowCalendarEmbed />}
          />
          <Route
            path="/e/upcomingShows/:venueID"
            element={<UpcomingShowsEmbed />}
          />
          <Route
            path="/e/sr/upcomingShows/:SRID"
            element={<UpcomingShowsEmbed />}
          />
          <Route
            path="/e/showCalendar/:venueID"
            element={<ShowCalendarEmbed />}
          />
          <Route
            path="/e/sr/showCalendar/:SRID"
            element={<ShowCalendarEmbed />}
          />
          <Route path="*" />
        </Routes>
        {/* <Shows /> */}
        {/* <Artists /> */}
        {/* <Register/> */}
        {/* <Button action={openSidebar(true)}></Button> */}
      </Grid>
    </Router>
  );
}

export default AppControl;
