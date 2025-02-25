import React from "react";
import { useGetAllVenuesQuery } from "../Redux/API/PublicAPI";
import Form from "../Components/Inputs/Form";
import { useAppSelector } from "../hooks";
import { useUpdatePerformanceAgreementMutation } from "../Redux/API/VenueAPI";

export default function PerformanceAgreementBuilder(props: {
  venueID: string;
  form?: string;
}) {
  const venues = useGetAllVenuesQuery();
  const [updatePerformanceAgreement] = useUpdatePerformanceAgreementMutation();
  const venue = venues.data?.[props.venueID];
  const form = useAppSelector(
    (state) => state.user.forms[props.form || "performanceAgreement"],
  );
  return (
    <>
      <p className="text-center mt-2">
        Below is your venue's performance agreement. Artists must agree to this
        when accepting an invite or applying for a gig. Use the text field below
        to enter individual pieces of your agreement; the artist will have to
        agree to all of them.
      </p>
      <Form
        fixedNav
        name={props.form || "performanceAgreement"}
        submitFn={updatePerformanceAgreement}
        additionalAuthParams={{ venueID: props.venueID }}
        formMap={[
          [
            {
              field: "agreement",
              fieldType: "list",
              defaultValue:
                form?.agreement || venue?.performanceAgreement?.agreement,
            },
          ],
        ]}
      />
    </>
  );
}
