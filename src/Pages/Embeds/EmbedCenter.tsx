import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
import EmbedGenerator from "../../Components/EmbedGenerator";

interface EmbedVenue {
  venueID: string;
  SGID?: null;
}

interface EmbedShowrunnerGroup {
  venueID?: null;
  SGID: string;
}

export default function EmbedCenter({
  SGID,
  venueID,
}: EmbedVenue | EmbedShowrunnerGroup) {
  // const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(setModalFullscreen(true));
  // return () => dispatch(setModalFullscreen(false))
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div>
        <EmbedGenerator
          title="Upcoming Shows"
          embedPath={SGID != null ? "e/sr/upcomingShows/" : "/e/upcomingShows/"}
          venueID={venueID}
          embedData={SGID}
          customizationConfig={[
            {
              name: "darkMode",
              label: "Use Dark Mode",
              type: "checkbox",
            },
            {
              name: "altTiles",
              label: "Use Alternative Tile Style",
              type: "checkbox",
            },
          ]}
        />
      </div>
      <div>
        <EmbedGenerator
          title="Show Calendar"
          embedPath={SGID != null ? "e/sr/showCalendar/" : "/e/showCalendar/"}
          venueID={venueID}
          embedData={SGID}
          customizationConfig={[
            {
              name: "darkMode",
              label: "Use Dark Mode",
              type: "checkbox",
            },
            {
              name: "classic",
              label: "Use Classic Display",
              type: "checkbox",
            },
          ]}
        />
      </div>
    </div>
  );
}
