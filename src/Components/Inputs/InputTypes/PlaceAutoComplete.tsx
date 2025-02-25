import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "../../../hooks";
import { formUpdate } from "../../../Redux/User/UserSlice";

export default function PlaceAutoComplete(props: {
  form: string;
  field: string;
  metaField?: string;
  containerClassName?: string;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  locationTypes?: any[];
}) {
  const [listenerActive, toggleListener] = useState(false);
  const autoCompleteRef = useRef<any>(null);
  const autocompleteContainerRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const error = false;

  const initAutoComplete = () => {
    const google: any = window.google;
    if (google) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(
        autocompleteContainerRef.current.children[0],
        {
          // https://developers.google.com/maps/documentation/places/web-service/supported_types
          types: props.locationTypes || ["(cities)"], // Restrict to cities
          componentRestrictions: { country: "US" }, // Restrict to the United States
        },
      );
      toggleListener(true);
      autoCompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  };

  const handlePlaceChanged = () => {
    const place = autoCompleteRef.current.getPlace();
    // The selected place is a city
    if (place) {
      const coordinates = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      dispatch(
        formUpdate({
          form: props.form,
          field: `meta.${
            props.metaField ? props.metaField : props.field + ".placeData"
          }`,
          value: place,
        }),
      );

      const address = place.formatted_address; // Access the city and state information
      dispatch(
        formUpdate({ form: props.form, field: props.field, value: address }),
      );
    }
  };

  useEffect(() => {
    initAutoComplete();
    return () => {
      if (listenerActive) {
        toggleListener(false);
        autoCompleteRef.current.removeListener("place_changed");
      }
    };
  }, []);

  return (
    <div
      className={`${props.containerClassName ? props.containerClassName : ""}`}
      ref={autocompleteContainerRef}
    >
      <input
        ref={autoCompleteRef}
        className={`border-b-2 p-1 max-w-full w-full rounded focus:border-orange peer ${
          error ? "border-red-400" : ""
        }${props.className ? props.className : ""}`}
        id="autocomplete-input"
        type="text"
        placeholder={props.placeholder || props.label || "Enter a location"}
        onChange={handlePlaceChanged}
        defaultValue={props.defaultValue || null}
        autoComplete="Address"
        required
      />
    </div>
  );
}
