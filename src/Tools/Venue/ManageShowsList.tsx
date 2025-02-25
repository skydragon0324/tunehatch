import React, { useCallback, useMemo, useState } from "react";
import { useGetAllShowsQuery } from "../../Redux/API/PublicAPI";
import { sortShowsByDate } from "../../Helpers/HelperFunctions";
import Card from "../../Components/Layout/Card";
import CountLabel from "../../Components/Labels/CountLabel";
import ShowTile from "../../Components/Tiles/ShowTile";
import FilterInput from "../../Components/Inputs/InputTypes/FilterInput";
import _ from "lodash";
import { Show } from "../../Helpers/shared/Models/Show";
import dayjs from "dayjs";
import { useGetShowPayoutStatusQuery } from "../../Redux/API/VenueAPI";
import { useAppSelector } from "../../hooks";

interface IManageShowListProps {
  venueID?: string;
  showrunnerID?: string;
  limit?: number;
}

const payoutStatuses: {
  name: string;
  slug: string;
  color: string;
}[] = [
  {
    name: "Paid",
    slug: "full",
    color: "rgb(74,222,128)",
  },
  {
    name: "Unpaid",
    slug: "unpaid",
    color: "rgb(239,68,68)",
  },
  {
    name: "Incomplete",
    slug: "partial",
    color: "rgb(234,179,8)",
  },
];

const ShowFilter: React.FC<{
  isPastShow?: boolean;
  selectedArtists: any[];
  setSelectedArtists: (artists: any) => void;
  date: string;
  setDate: (date: string) => void;
  selectedPayoutStatus: string[];
  setSelectedPayoutStatus: (payoutStatus: string) => void;
}> = ({
  isPastShow,
  selectedArtists,
  setSelectedArtists,
  date,
  setDate,
  selectedPayoutStatus,
  setSelectedPayoutStatus,
}) => {
  return (
    <div>
      <div className="py-2 flex items-center gap-2 md:gap-5 flex-wrap mb-2">
        <div className="flex items-center gap-2">
          <div>
            <p>Show Date</p>
          </div>
          <input
            type="date"
            placeholder="Show Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="outline flex-grow outline-gray-300 focus:ring text-gray-500 rounded-full p-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p>Artists</p>
          </div>
          <FilterInput
            placeholder="Select Artists"
            type="artist"
            value={selectedArtists}
            selectFn={(val: { uid?: string; id?: string; name: string }) => {
              setSelectedArtists([...selectedArtists, val]);
            }}
            removeFn={(target: any) => {
              const artists = [...selectedArtists];
              _.remove(artists, (val) => (val.id || val.uid) === target.id);
              setSelectedArtists(artists);
            }}
          />
        </div>
        {isPastShow && (
          <div className="flex items-center gap-4">
            <div>
              <p>Payout Status</p>
            </div>
            {payoutStatuses.map((payoutStatus, i) => (
              <button
                key={i}
                className={`rounded-lg py-1 px-4 text-sm border`}
                style={{
                  borderColor: payoutStatus.color,
                  backgroundColor: selectedPayoutStatus?.includes(
                    payoutStatus.slug
                  )
                    ? payoutStatus.color
                    : "transparent",
                  color: selectedPayoutStatus?.includes(payoutStatus.slug)
                    ? "white"
                    : "black",
                }}
                onClick={() => setSelectedPayoutStatus(payoutStatus.slug)}
              >
                {payoutStatus.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

enum ShowFilterTypes {
  PENDING = "pending",
  UPCOMING = "upcoming",
  PAST = "past",
}

function doesVenueOrSRMatch(show: Show, showrunnerID: string, venueID: string) {
  return (
    (venueID != null && show.venueID === venueID) ||
    (showrunnerID != null &&
      show.showrunner?.find(
        (sr: { id?: string; uid?: string; _key?: string }) =>
          (sr.id || sr.uid || sr._key) === showrunnerID
      ))
  );
}

export default function ManageShowsList({
  showrunnerID,
  ...props
}: IManageShowListProps) {
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const showList = sortShowsByDate(shows ? shows.data : {});
  const payouts = useGetShowPayoutStatusQuery(
    {
      SECRET_UID: user.uid,
      showIDs: showList.filter((show) => show.venueID === props.venueID),
      venueID: props.venueID,
    },
    { skip: !showList || !showList.length }
  );

  const limit = props.limit || 5;
  const [limits, setLimits] = useState({
    pending: limit,
    upcoming: limit,
    past: limit,
  });

  const [filterConditions, setFilterConditions] = useState<{
    [key in `${ShowFilterTypes}`]: {
      showDate: string;
      artists: { id?: string; uid?: string; name: string }[];
      paymentStatus?: string[];
    };
  }>({
    [ShowFilterTypes.PENDING]: {
      showDate: "",
      artists: [],
    },
    [ShowFilterTypes.UPCOMING]: {
      showDate: "",
      artists: [],
    },
    [ShowFilterTypes.PAST]: {
      showDate: "",
      artists: [],
      paymentStatus: [],
    },
  });

  const filterBasedOnFilterConditions = useCallback(
    (show: Show, type: `${ShowFilterTypes}`) => {
      const { showDate, artists, paymentStatus } = filterConditions[type];

      return (
        (!showDate || dayjs(showDate).isSame(dayjs(show.starttime), "day")) &&
        (!artists.length ||
          // At least one performer must match one of the artists that the
          // user asked to filter by. We filter by id (or uid as a backup).
          // There can be artists with duplicate names, so we should NEVER filter by the name.
          show.performers.find((x) =>
            artists.find((y) => (x.id || x.uid) === (y.id || y.uid))
          )) &&
        (!paymentStatus?.length ||
          paymentStatus.includes(payouts.data[show._key]))
      );
    },
    [filterConditions, payouts.data]
  );

  const updateFilterConditions = useCallback(
    (filter: `${ShowFilterTypes}`, updateItem: { [key: string]: any }) => {
      setFilterConditions({
        ...filterConditions,
        [filter]: {
          ...filterConditions[filter],
          ...updateItem,
        },
      });
    },
    [filterConditions]
  );

  const allShowFilters = useMemo(() => {
    return {
      [ShowFilterTypes.PENDING]: showList.filter((show) => {
        if (
          doesVenueOrSRMatch(show, showrunnerID, props.venueID) &&
          !show.published &&
          new Date(show.endtime).getTime() > Date.now() &&
          filterBasedOnFilterConditions(show, "pending")
        ) {
          return show;
        }

        return false;
      }),

      [ShowFilterTypes.UPCOMING]: showList.filter((show) => {
        if (
          doesVenueOrSRMatch(show, showrunnerID, props.venueID) &&
          show.published &&
          new Date(show.endtime).getTime() > Date.now() &&
          filterBasedOnFilterConditions(show, "upcoming")
        ) {
          return show;
        }

        return false;
      }),

      [ShowFilterTypes.PAST]: sortShowsByDate(shows?.data || {}, "desc").filter(
        (show) => {
          if (
            doesVenueOrSRMatch(show, showrunnerID, props.venueID) &&
            show.published &&
            new Date(show.endtime).getTime() < Date.now() &&
            filterBasedOnFilterConditions(show, "past")
          ) {
            return show;
          }

          return false;
        }
      ),
    };
  }, [showList, shows?.data, props.venueID]);

  return (
    <>
      {(Object.keys(allShowFilters) as `${ShowFilterTypes}`[]).map(
        (showFilter, i) => {
          const filteredShows = allShowFilters[showFilter];
          return (
            <div key={i}>
              <CountLabel
                label={`${showFilter} Shows`}
                className="text-2xl font-black p-2"
                count={filteredShows.length}
                hideCount={showFilter === "past"}
              />
              <div className="w-11/12 mx-auto">
                <ShowFilter
                  isPastShow={showFilter === "past"}
                  date={filterConditions[showFilter].showDate}
                  setDate={(showDate) =>
                    updateFilterConditions(showFilter, { showDate })
                  }
                  selectedArtists={filterConditions[showFilter].artists}
                  setSelectedArtists={(artists) =>
                    updateFilterConditions(showFilter, { artists })
                  }
                  selectedPayoutStatus={
                    filterConditions[showFilter]?.paymentStatus || []
                  }
                  setSelectedPayoutStatus={(status) => {
                    const selectedStatus = [
                      ...filterConditions[showFilter]?.paymentStatus,
                    ];
                    if (selectedStatus.includes(status)) {
                      _.remove(selectedStatus, (s) => s === status);
                    } else {
                      selectedStatus.push(status);
                    }

                    updateFilterConditions(showFilter, {
                      paymentStatus: selectedStatus,
                    });
                  }}
                />
                <Card className="rounded-md">
                  {filteredShows.length > 0 ? (
                    filteredShows.map((show, i: number) => {
                      if (i < limits[showFilter]) {
                        return (
                          <ShowTile
                            showID={show._key}
                            manageView
                            viewType="venue"
                            key={"manageShow/" + show._key}
                            limit={5}
                            payoutStatus={payouts.data?.[show._key]}
                          />
                        );
                      } else if (i === limits[showFilter]) {
                        return (
                          <button
                            className="p-2 text-center w-full hover:bg-gray-200 cursor-pointer text-blue-400"
                            onClick={() => {
                              setLimits({
                                ...limits,
                                [showFilter]: limits[showFilter] + limit,
                              });
                            }}
                          >
                            Show More...
                          </button>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <p className="text-center">
                      You do not currently have any {showFilter} shows.
                    </p>
                  )}
                </Card>
              </div>
            </div>
          );
        }
      )}
      {/* <CountLabel
        label="Pending Shows"
        className="text-2xl font-black p-2"
        count={pendingShows.length}
      />
      <div className="w-11/12 mx-auto">
        <ShowFilter />
        <Card className="rounded-md">
          {pendingShows.length > 0 ? (
            pendingShows.map((show, i: number) => {
              if (i < limits.pending) {
                return (
                  <ShowTile
                    showID={show._key}
                    manageView
                    viewType="venue"
                    key={"manageShow/" + show._key}
                    limit={5}
                  />
                );
              } else if (i === limits.pending) {
                return (
                  <a
                    className="p-2 text-center w-full hover:bg-gray-200 cursor-pointer text-blue-400"
                    onClick={() => {
                      setLimits({
                        ...limits,
                        pending: limits.upcoming + limit,
                      });
                    }}
                  >
                    Show More...
                  </a>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p className="text-center">
              You do not currently have any pending shows.
            </p>
          )}
        </Card>
      </div>
      <CountLabel
        label="Upcoming Shows"
        className="text-2xl font-black p-2"
        count={upcomingShows.length}
      />
      <div className="w-11/12 mx-auto">
        <Card className="rounded-md">
          {upcomingShows.length > 0 ? (
            upcomingShows.map((show, i: number) => {
              if (i < limits.upcoming) {
                return (
                  <ShowTile
                    showID={show._key}
                    manageView
                    viewType="venue"
                    key={"manageShow/" + show._key}
                  />
                );
              } else if (i === limits.upcoming) {
                return (
                  <a
                    className="p-2 text-center w-full hover:bg-gray-200 cursor-pointer text-blue-400"
                    onClick={() => {
                      setLimits({
                        ...limits,
                        upcoming: limits.upcoming + limit,
                      });
                    }}
                  >
                    Show More...
                  </a>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p className="text-center">
              You do not currently have any pending shows.
            </p>
          )}
        </Card>
      </div>
      <h2 className="text-2xl font-black p-2">Past Shows</h2>
      <div className="w-11/12 mx-auto">
        <Card className="rounded-md">
          {pastShows.length > 0 ? (
            pastShows.map((show, i: number) => {
              if (i < limits.past) {
                return (
                  <ShowTile
                    showID={show._key}
                    manageView
                    viewType="venue"
                    key={"manageShow/" + show._key}
                  />
                );
              } else if (i === limits.past) {
                return (
                  <a
                    className="p-2 text-center w-full hover:bg-gray-200 cursor-pointer text-blue-400"
                    onClick={() => {
                      setLimits({ ...limits, past: limits.past + limit });
                    }}
                  >
                    Show More...
                  </a>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p className="text-center">You do not have any past shows.</p>
          )}
        </Card>
      </div> */}
    </>
  );
}
