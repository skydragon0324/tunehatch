import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";
import Button from "../../Buttons/Button";

export default function ButtonToggle(props: {
  value: any;
  form: string | number;
  warnWhenData: any[];
  warnMessage: any;
  clickFn: (val: boolean) => void;
  className: any;
  label: any;
}) {
  const active = props.value;
  const form = useAppSelector((state) => state.user.forms[props.form]);

  const toggle = (value: boolean) => {
    let warn = false;
    let confirmed = true;
    if (form && props.warnWhenData) {
      props.warnWhenData.forEach((field) => {
        if (form[field]) {
          warn = true;
        }
      });
    }
    if (warn) {
      confirmed = window.confirm(
        props.warnMessage ||
          "This will clear the portion of the form that uses this data. Continue?"
      );
    }
    if (confirmed) {
      props.clickFn(value);
    }
  };

  return (
    <Button
      onClick={() => toggle(!active)}
      active={active}
      inline
      full
      className={`inline h-10 border border-gray ${
        props.className ? props.className : ""
      }`}
    >
      {props.label}
    </Button>
  );
}
