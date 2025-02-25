import React, { useEffect, useState } from "react";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import {
  displayTicketPrice,
  renderPageTitle,
  sortShowsByDate,
} from "../../../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
import LoadingWrapper from "../LoadingWrapper";
import Card from "../Card";
import Img from "../../Images/Img";
import IconButton from "../../Buttons/IconButton";
import Button from "../../Buttons/Button";
import ShowCard2 from "../../Cards/ShowCard/ShowCard2";
import { useAppSelector } from "../../../hooks";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import RegionPicker from "../../Geography/RegionPicker";
import EmergingMarket from "../../EmergingMarket";
import ShowWeekSorter from "./Filters/ShowWeekSorter";
import dayjs from "dayjs";
import { isArray } from "lodash";

interface IFilterCriteria {
  activeVenue?: string | null;
  date?: string | Date | null;
  name?: string;
  paidOnly?: string | null;
  freeOnly?: string | null;
  locations?: Array<string> | null;
  weekday?: any;
}

const initialFilter: IFilterCriteria = {
  activeVenue: null,
  date: null,
  name: "",
  freeOnly: null,
  paidOnly: null,
  weekday: null,
  locations: [],
};

export default function ShowSorter(props: { gigs?: boolean }) {
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  const [filterCriteria, setFilterCriteria] = useState(initialFilter);
  const [filteringActive, setFilteringActive] = useState(false);
  const [rawDateInput, setRawDateInput] = useState<string>();
  const [sortedShows, setSortedShows] = useState([]);
  const [filterResults, setFilterResults] = useState([]);
  const currentRegion = useAppSelector(
    (state) => state.user.location.currentRegion
  );
  const currentRegionLocations = useAppSelector(
    (state) => state.user.location.currentRegionLocations
  );
  const currentRegionFeatured = useAppSelector(
    (state) => state.user.location.currentRegionFeatured
  );
  const eventType = props.gigs ? "Gigs" : "Shows";

  useEffect(() => {
    renderPageTitle("Shows");
  }, []);

  useEffect(() => {
    if (shows.data) {
      setSortedShows(sortShowsByDate(shows.data as any));
    }
  }, [shows.data]);

  const updateFilterCriteria = (
    criteria: keyof IFilterCriteria,
    value: any
  ) => {
    if (criteria === "date" && isNaN(Date.parse(value))) {
      value = null;
    }

    let tFilterCriteria = { ...filterCriteria };
    tFilterCriteria[criteria] = value;
    setFilterCriteria(tFilterCriteria);
  };

  useEffect(() => {
    let now = Date.now();
    let active = false;

    const filterFn = (show: any) => {
      let match = false;
      if (
        typeof show === "object" &&
        !show.deleted &&
        !show.private &&
        (props.gigs ? true : show.published) &&
        (props.gigs ? !show.lineup_locked : true) &&
        new Date(show.endtime).getTime() > now
      ) {
        match = true;
      }
      if (filterCriteria.activeVenue && match) {
        match = filterCriteria.activeVenue === show.venueID;
      }
      if (filterCriteria.date && match) {
        let startDate = new Date(show.starttime);
        startDate.setHours(0, 0, 0, 0);
        let filterDate = new Date(filterCriteria.date);
        filterDate.setHours(0, 0, 0, 0);
        match = startDate.getTime() === filterDate.getTime();
      }
      if (filterCriteria.name && match) {
        let name = filterCriteria.name.toLowerCase();
        let showName = show.name.toLowerCase();
        match = showName.includes(name);
      }
      if (filterCriteria.freeOnly && match) {
        console.log(displayTicketPrice(show));
        match = displayTicketPrice(show) === "Free";
      }
      if (filterCriteria.paidOnly && match) {
      }
      if (filterCriteria.locations.length && match) {
        const venueLocationCode = getVenueLocationCode(
          venues?.data?.[show.venueID]
        );
        console.log(venueLocationCode);
        console.log(filterCriteria.locations);
        if (filterCriteria.locations?.includes(venueLocationCode)) {
          match = true;
        } else {
          match = false;
        }
      }
      if (filterCriteria.weekday && match) {
        let showWeekday = dayjs(show.starttime).format("dddd");
        if (showWeekday === filterCriteria.weekday) {
          match = true;
        } else {
          match = false;
        }
      }
      return match;
    };

    Object.keys(filterCriteria).forEach((criteria) => {
      if (
        (filterCriteria[criteria as keyof IFilterCriteria] !== null &&
        filterCriteria[criteria as keyof IFilterCriteria] !== "") && 
        (!isArray(filterCriteria[criteria as keyof IFilterCriteria]) || filterCriteria[criteria as keyof IFilterCriteria].length > 0)
      ) {
        active = true;
      }
    });
    let tFilterResults = sortedShows.filter((show) => filterFn(show));
    setFilterResults(tFilterResults);
    setFilteringActive(active);
  }, [filterCriteria, sortedShows]);
  useEffect(() => {
    setFilterCriteria({ ...filterCriteria, locations: currentRegionLocations });
  }, [currentRegionLocations]);
  return (
    <LoadingWrapper
      queryResponse={[shows, venues]}
      requiredData={[sortedShows]}
    >
      <section>
        <h1 className="font-black text-xl pl-4 pt-4">Select A City</h1>
        <RegionPicker />
        {props.gigs ? (
          <>
            <h1 className="font-black text-xl pl-4 pt-4">Available Gigs</h1>
            <ShowWeekSorter
              shows={filterResults || sortedShows}
              updateFn={(value: string) =>
                updateFilterCriteria("weekday", value)
              }
              filtersActive={filterCriteria["weekday"] !== null}
            />
          </>
        ) : (
          <></>
        )}
        <h1 className="font-black text-xl pl-4 pt-4">
          Popular Venues This Week
        </h1>
        <div className="w-full p-4 overflow-x-scroll snap-x focus:scroll-auto">
          <div className="flex flex-row gap-3 min-w-full">
            {venues.data &&
              Object.keys(venues.data)?.map((venue, i) => {
                const { name, capacity, avatar, _key } = venues.data?.[venue];
                let showVenue = false;
                filterResults.forEach((show) => {
                  if (
                    !showVenue &&
                    show?.venueID === _key &&
                    new Date(show.endtime).getTime() > Date.now() &&
                    (props.gigs ? true : show.published) &&
                    (props.gigs ? !show.lineup_locked : true) &&
                    !show.deleted
                  ) {
                    showVenue = true;
                  }
                });
                if (avatar && showVenue) {
                  return (
                    <Card
                      key={venue}
                      className={`${
                        venue === filterCriteria.activeVenue
                          ? "border-2 border-orange"
                          : ""
                      } rounded-xl h-72 w-52 text-center border hover:shadow-lg transition-shadow hover:cursor-pointer`}
                      // selected={venue === filterCriteria.activeVenue}
                      onClick={() =>
                        venue === filterCriteria.activeVenue
                          ? updateFilterCriteria("activeVenue", null)
                          : updateFilterCriteria("activeVenue", venue)
                      }
                    >
                      <div className="flex flex-col w-full flex-grow p-4">
                        <Img
                          className="rounded-full p-4 w-36 h-36 self-center"
                          src={avatar}
                        />
                        <h1 className="text-xl justify-center text-center font-bold flex-wrap">
                          {name}
                        </h1>
                        {capacity ? (
                          <div className="text-xs align-center">
                            <b>Capacity</b>
                            <br />
                            <span>{capacity}</span>
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="flex flex-grow items-end">
                          <IconButton
                            className="hover:bg-inherit justify-center flex mx-auto"
                            icon="expand_more"
                          />
                        </div>
                      </div>
                    </Card>
                  );
                } else {
                  return <div className="hidden" key={i}></div>;
                }
              })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-8 justify-center w-full p-6 gap-6">
          {props.gigs ? (
            <></>
          ) : (
            <>
              <div className="flex md:col-span-2 gap-2 items-center">
                <p>Show Date</p>
                <input
                  type="date"
                  value={rawDateInput}
                  onChange={(e) => {
                    setRawDateInput(e.target.value);
                    updateFilterCriteria("date", new Date(e.target.value));
                  }}
                  className="outline flex-grow outline-gray-300 focus:ring text-gray-500 rounded-full p-1"
                />
              </div>
              <div className="flex md:col-span-4 gap-2 items-center">
                <p>Show Name</p>
                <input
                  type="text"
                  onChange={(e) => updateFilterCriteria("name", e.target.value)}
                  className="flex-grow outline outline-gray-300 focus:ring text-gray-500 rounded-full p-1"
                />
              </div>
            </>
          )}
          {props.gigs ? (
            <div className="flex md:col-span-2 gap-2 items-center">
              <span
                className={`outline w-full outline-gray-300 text-center rounded-full p-1 ${
                  filterCriteria.freeOnly ? "bg-orange text-white" : ""
                }`}
                onClick={(e) =>
                  updateFilterCriteria("paidOnly", !filterCriteria.paidOnly)
                }
              >
                <p>Paid Only</p>
              </span>
            </div>
          ) : (
            <div className="flex md:col-span-2 gap-2 items-center">
              <span
                className={`outline w-full outline-gray-300 text-center rounded-full p-1 ${
                  filterCriteria.freeOnly ? "bg-orange text-white" : ""
                }`}
                onClick={(e) =>
                  updateFilterCriteria("freeOnly", !filterCriteria.freeOnly)
                }
              >
                <p>Free Only</p>
              </span>
            </div>
          )}
          {filteringActive && (
            <Button
              className="w-full"
              onClick={() => {
                setRawDateInput("");
                setFilterCriteria(initialFilter);
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </section>
      <section>
        <h1 className="font-black text-2xl pl-4">{`Upcoming ${eventType}`}</h1>
        <div className="grid grid-cols-1 gap-4 p-4 mr-4">
          {filterResults.length < 5 &&
            currentRegionFeatured &&
            currentRegion && <EmergingMarket cityName={currentRegion} />}
          {filterResults.map((show, i) => {
            return <ShowCard2 isGig={props.gigs} key={show._key} show={show} />;
          })}
          {!filterResults.length && filteringActive && (
            <div className="text-center">
              <h1 className="font-black text-2xl">
                No shows meet your search criteria.
              </h1>
              <p className="text-md">
                We are always getting new shows, so check back soon! To browse
                all available shows, reset your filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </LoadingWrapper>
  );
}
