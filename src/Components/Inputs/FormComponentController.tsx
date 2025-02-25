import React from "react";
import FlyerBuilder from "../../Tools/Venue/FlyerBuilder";
import PaymentAgreementBuilder from "../../Forms/PaymentAgreementBuilder";
import ArtistInviteSelection from "../../Tools/Venue/LineupBuilder/ArtistInviteSelection";
import RepeatingShowForm from "../../Forms/CreateShow/RepeatingShowForm";

export default function FormComponentController(props: {
  component:
    | "FlyerBuilder"
    | "PaymentAgreementBuilder"
    | "ArtistInviteSelection"
    | "RepeatingShowForm";
  componentProps: {
    form?: string;
    venueID?: string;
  };
}) {
  switch (props.component) {
    case "FlyerBuilder":
      return <FlyerBuilder {...(props.componentProps || null)} />;
    case "PaymentAgreementBuilder":
      return (
        <PaymentAgreementBuilder
          venueID={props.componentProps.venueID}
          form={props.componentProps.form}
        />
      );
    case "ArtistInviteSelection":
      return (
        <ArtistInviteSelection
          form={props.componentProps.form}
          venueID={props.componentProps.venueID}
          showID={props.componentProps.venueID}
        />
      );
    case "RepeatingShowForm":
      return <RepeatingShowForm form={props.componentProps.form} />;
  }
}
