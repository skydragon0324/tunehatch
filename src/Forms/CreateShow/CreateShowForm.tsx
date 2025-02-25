import React, { useEffect, useMemo, useState } from "react";
import Form, { FormMapProps } from "../../Components/Inputs/Form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import {
  clearForm,
  formAppend,
  formArrayUpdate,
  formSplice,
  formUpdate,
} from "../../Redux/User/UserSlice";
import {
  useCreateShowMutation,
  useEditShowMutation,
} from "../../Redux/API/VenueAPI";
import { DEFAULT_CALTAGS } from "../../Helpers/shared/calTagsConfig";
import { resetModal, updateView } from "../../Redux/UI/UISlice";
import { Show } from "../../Helpers/shared/Models/Show";
import { getVenueLocationCode } from "../../Helpers/shared/getVenueLocationCode";
import { useGetActiveRegionsQuery } from "../../Redux/API/RegionAPI";

export default function CreateShowForm(props: {
  venueID?: string;
  showrunnerID?: string;
  defaultDate?: Date | string;
  show?: Show;
}) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.user.forms.createShow);
  const venues = useGetAllVenuesQuery();
  const venue = useMemo(
    () => venues?.data?.[props.venueID || props.show?.venueID],
    [venues, props.show]
  );
  const venueID = useMemo(
    () => (venue ? [Object.assign({}, venue, { id: (venue as any)._id })] : []),
    [venue]
  );

  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners?.data?.[props.showrunnerID];

  const activeRegions = useGetActiveRegionsQuery();
  const regions = activeRegions.data;
  const [timezone, setTimezone] = useState("America/Chicago");
  const regionCode = getVenueLocationCode(venue);

  useEffect(() => {
    if (regions && regionCode) {
      regions.forEach((region) => {
        if (region.locations.includes(regionCode)) {
          setTimezone(region.timezone);
        }
      });
    }
  }, [regions, regionCode]);

  const [createShow] = useCreateShowMutation();

  const [ticketTiers, setTicketTiers] = useState(
    props.show?.ticket_tiers ? Object.keys(props.show?.ticket_tiers)?.length : 1
  );
  const [ticketTierFormData, setTicketTierFormData] = useState([]);
  const [editShow] = useEditShowMutation();

  const generateCalTagMap = () => {
    let optionMap: { [key: string]: any } = {};
    Object.keys(DEFAULT_CALTAGS).forEach((calTag) => {
      optionMap[calTag] =
        DEFAULT_CALTAGS[calTag as keyof typeof DEFAULT_CALTAGS].label;
    });
    return optionMap;
  };

  useEffect(() => {
    let ticketTierFormData: FormMapProps[] = [];
    Array.from(Array(ticketTiers).keys()).forEach((tier, i) => {
      if (form?.["meta.advancedTicketing"]) {
        ticketTierFormData.push({
          fieldType: "title",
          defaultValue: <>Tier {tier + 1}</>,
          className: "",
        });
      }
      ticketTierFormData.push({
        field: `ticket_tiers.${tier}.name`,
        defaultValue:
          props.show?.ticket_tiers &&
          Object.keys(props.show?.ticket_tiers)?.length > 0
            ? props.show?.ticket_tiers[tier].name
            : "",
        fieldType: "text",
        placeholder: "Name",
        prerequisite: form?.["meta.advancedTicketing"] || false,
        containerClassName: "col-span-6",
      });
      ticketTierFormData.push({
        field: `ticket_tiers.${tier}.description`,
        defaultValue:
          props.show?.ticket_tiers &&
          Object.keys(props.show?.ticket_tiers)?.length > 0
            ? props.show?.ticket_tiers[tier].description
            : "",
        fieldType: "text",
        placeholder: "Description",
        prerequisite: form?.["meta.advancedTicketing"] || false,
        containerClassName: "col-span-6",
      });
      ticketTierFormData.push({
        field: `ticket_tiers.${tier}.price`,
        defaultValue:
          props.show?.ticket_tiers &&
          Object.keys(props.show?.ticket_tiers)?.length > 0
            ? props.show?.ticket_tiers[tier].price
            : "",
        fieldType: "number",
        placeholder: "Price",
        required: true,
        prerequisite: form?.["meta.advancedTicketing"] || false,
        containerClassName: "col-span-3",
        className: "w-full",
      });
      ticketTierFormData.push({
        field: `ticket_tiers.${tier}.quantity`,
        defaultValue:
          props.show?.ticket_tiers &&
          Object.keys(props.show?.ticket_tiers)?.length > 0
            ? props.show?.ticket_tiers[tier].quantity
            : "",
        fieldType: "number",
        placeholder: "Quantity",
        required: !props.show ? true : false,
        prerequisite: form?.["meta.advancedTicketing"] || false,
        containerClassName: "col-span-3",
        className: "w-full",
      });
    });
    setTicketTierFormData(ticketTierFormData);
  }, [ticketTiers, form?.["meta.advancedTicketing"]]);

  return (
    <Form
      name="createShow"
      className="grid grid-cols-6 w-full gap-y-2 p-4 gap-2"
      fixedNav
      additionalAuthParams={{ venueID: venue?._key || props.show?.venueID }}
      separateFormObject={true}
      clearOnComplete
      successStatusMessage={!props.show ? "Show created!" : "Show Edited!"}
      onComplete={() => (props.show ? dispatch(resetModal()) : null)}
      submitFn={!props.show?._key ? createShow : editShow}
      formMap={[
        !props.show
          ? [
              {
                fieldType: "title",
                defaultValue: "What type of show are you putting on?",
                className:
                  "col-span-6 text-2xl text-center font-black w-full mb-4",
              },
              {
                //do not include on edit
                field: "meta.showType",
                required: !props.show ? true : false,
                fieldType: "buttonSelectGroup",
                containerClassName: "w-full col-span-6",
                placeholder: "",
                triggerPageChange: true,
                optionMap: [
                  {
                    name: "I Know Who's Performing",
                    description:
                      "For shows that already have a confirmed lineup.",
                    value: "IKWP",
                  },
                  {
                    name: "I'm Looking For Talent",
                    description:
                      "Post a gig and pick from over 1,000 local artists through TuneHatch",
                    value: "Gig",
                  },
                ],
              },
            ]
          : [],
        [
          {
            fieldType: "title",
            defaultValue: "Show Details",
            className: "text-3xl font-black col-span-6 text-center",
          },
          {
            field: "showID",
            defaultValue: props.show?._key,
            prerequisite: props.show?._key || false,
            hidden: true,
            required: props.show?._key || false,
          },
          {
            field: "name",
            placeholder: "Show Name",
            defaultValue: !props.show ? "" : props.show?.name,
            large: true,
            required: true,
            containerClassName: "col-span-6",
          },
          {
            field: "description",
            placeholder: "Show Description",
            defaultValue: !props.show ? "" : props.show?.description,
            fieldType: "textarea",
            containerClassName: "col-span-6",
          },
          {
            form: "createShow",
            field: "performers",
            placeholder: "Add Performers...",
            hidden: form["meta.showType"] !== "IKWP",
            className: "w-full",
            containerClassName: "col-span-6",
            fieldType: "filterInput",
            filterType: "artist",
            value: form.performers || props.show?.performers || [],
            selectFn: (e: any) =>
              dispatch(
                formAppend({
                  form: "createShow",
                  field: "performers",
                  value: e,
                })
              ),
            removeFn: (e: any) =>
              dispatch(
                formSplice({
                  form: "createShow",
                  field: "performers",
                  key: "name",
                  value: e,
                })
              ),
          },
          {
            field: "starttime",
            mustBeBefore: "endtime",
            fieldType: "timestamp",
            timezone: timezone,
            defaultValue: props.show?.starttime
              ? new Date(props.show?.starttime)
              : new Date(props.defaultDate).setHours(18, 0, 0, 0),
            placeholder: "Start Time",
            allowPast: true,
            containerClassName: "col-span-6 md:col-span-3",
          },
          {
            field: "endtime",
            mustBeAfter: "starttime",
            fieldType: "timestamp",
            timezone: timezone,
            defaultValue: props.show?.endtime
              ? new Date(props.show?.endtime)
              : props.defaultDate,
            placeholder: "End Time",
            allowPast: true,
            containerClassName: "col-span-6 md:col-span-3",
          },
          {
            //do not include on edit
            field: "meta.repeatingShow",
            fieldType: "buttonToggle",
            placeholder: "Repeating Show",
            containerClassName: "col-span-6 md:col-span-2 pb-4 md:pb-0",
            prerequisite: !props.show,
          },
          {
            //do not include on edit
            fieldType: "component",
            component: "RepeatingShowForm",
            containerClassName: "col-span-6 pb-4 md:pb-0",
            componentProps: { form: "createShow" },
            prerequisite: !props.show && form?.["meta.repeatingShow"],
          },
          {
            field: "ticket_cost",
            placeholder: "Ticket Price",
            defaultValue: props.show ? props.show?.ticket_cost : null,
            prerequisite: !form?.["meta.advancedTicketing"],
            fieldType: "number",
            containerClassName: "col-span-3 md:col-span-2",
            className: "w-full",
          },
          {
            field: "doorPrice",
            placeholder: "Door Price",
            fieldType: "number",
            prerequisite: !form?.["meta.advancedTicketing"],
            clickToEnable: true,
            defaultValue: props.show?.doorPrice,
            containerClassName: "col-span-3 md:col-span-2",
          },
          ...ticketTierFormData,
          {
            field: "meta.addTicketTier",
            fieldType: "button",
            prerequisite: form["meta.advancedTicketing"] || false,
            placeholder: "Add Ticket Tier",
            icon: "add",
            clickFn: () => setTicketTiers(ticketTiers + 1),
            containerClassName: "col-span-6 md:col-span-3",
          },
          {
            field: "meta.advancedTicketing",
            fieldType: "buttonToggle",
            defaultValue: props.show?.ticket_tiers
              ? Object.keys(props.show?.ticket_tiers)?.length > 0
              : false,
            warnWhenData: [
              "ticket_tiers.0.name",
              "ticket_tiers.0.description",
              "ticket_tiers.0.price",
              "ticket_tiers.0.quantity",
            ],
            warnMessage:
              "This will clear all ticket tiers for this show. Continue?",
            placeholder: form["meta.advancedTicketing"]
              ? "Disable Advanced Ticketing"
              : "Advanced Ticketing",
            containerClassName: form["meta.advancedTicketing"]
              ? "col-span-6 md:col-span-3 pb-4 md:pb-0"
              : "col-span-6 md:col-span-2 pb-4 md:pb-0",
          },
          props.showrunnerID != null
            ? {
                form: "createShow",
                field: "venueID",
                placeholder: "Add Venue...",
                className: "w-full",
                limit: 1,
                containerClassName: "col-span-6 mb-2",
                fieldType: "filterInput",
                filterType: "venue",
                defaultValue: venueID,
                required: true,
                value:
                  form.venueID == null
                    ? []
                    : Array.isArray(form.venueID)
                    ? form.venueID
                    : [form.venueID],
                selectFn: (e: string) =>
                  dispatch(
                    formUpdate({
                      form: "createShow",
                      field: "venueID",
                      value: [e],
                    })
                  ),
                removeFn: (e: string) =>
                  dispatch(
                    formUpdate({
                      form: "createShow",
                      field: "venueID",
                      value: [],
                    })
                  ),
              }
            : {
                field: "venueID",
                defaultValue: venue?._key,
                hidden: true,
                required: true,
              },
          showrunner == null
            ? {
                form: "createShow",
                field: "showrunner",
                placeholder: "Add Showrunner...",
                className: "w-full",
                limit: 1,
                containerClassName: "col-span-6 mb-2",
                fieldType: "filterInput",
                filterType: "showrunner",
                defaultValue: props.show?.showrunner,
                value: form.showrunner || [],
                selectFn: (e: string) =>
                  dispatch(
                    formAppend({
                      form: "createShow",
                      field: "showrunner",
                      value: e,
                    })
                  ),
                removeFn: (e: string) =>
                  dispatch(
                    formSplice({
                      form: "createShow",
                      field: "showrunner",
                      key: "name",
                      value: e,
                    })
                  ),
              }
            : {
                field: "showrunner",
                defaultValue: [showrunner],
                hidden: true,
                required: true,
              },

          {
            field: "min_age",
            type: "number",
            // hidden: !form?.["meta.venueOptions"],
            fieldType: "number",
            placeholder: "Minimum Age",
            defaultValue: venue?.min_age || props.show?.min_age,
            containerClassName: "col-span-3",
            className: "w-full",
          },
          {
            field: "capacity",
            type: "number",
            // hidden: !form?.["meta.venueOptions"],
            fieldType: "number",
            placeholder: "Number of Available Tickets",
            defaultValue: props.show ? props.show?.capacity : venue?.capacity,
            containerClassName: "col-span-6 md:col-span-3",
            className: "w-full",
          },
          {
            field: "private",
            fieldType: "toggleSlider",
            defaultValue: !props.show ? false : props.show?.private,
            label: "Private Event",
            containerClassName:
              "col-span-6 md:col-span-3 lg:col-span-2 lg:mx-auto",
          },
          {
            field: "cohosted",
            fieldType: "toggleSlider",
            label: "Artists Can Manage Show",
            defaultValue: !props.show ? false : props.show?.cohosted,
            containerClassName:
              "col-span-6 md:col-span-3 lg:col-span-2 lg:mx-auto pb-2 md:pb-0",
          },
          {
            fieldType: "dropdown",
            field: "calTag",
            colorMap: DEFAULT_CALTAGS,
            containerClassName: "col-span-6 lg:col-span-1",
            label: "Calendar Color",
            optionMap: generateCalTagMap(),
            defaultValue: props?.show?.calTag || "green",
            className: "mx-auto",
          },
        ],
        !props.show
          ? [
              {
                //do not include this page on edit
                fieldType: "component",
                component: "FlyerBuilder",
                containerClassName: "col-span-6",
                componentProps: {
                  form: "createShow",
                },
                key: "FlyerBuilder",
              },
            ]
          : [],
        !props.show
          ? [
              //do not include this page on edit
              {
                fieldType: "title",
                defaultValue: "Payment Agreement",
                className: "text-2xl w-full font-black col-span-6",
              },
              {
                fieldType: "title",
                defaultValue: `Choose how artists who perform at your show will be paid. These will be the defaults for artists who are invited or apply.
      You can change specifics on guarantees and production fees for each artist who you invite or receieve an application from.`,
                className: "col-span-6",
              },
              {
                fieldType: "component",
                containerClassName: "col-span-6",
                component: "PaymentAgreementBuilder",
                componentProps: {
                  form: "createShow",
                  venueID: props.venueID,
                },
                key: "FlyerBuilder",
              },
            ]
          : [],
      ]}
    />
  );
}
