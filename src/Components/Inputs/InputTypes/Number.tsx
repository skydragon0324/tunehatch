import React from "react";

export default function Number(props: {
  allowNegative: any;
  onChange: (arg0: any) => void;
  className: string;
  validationFn: (e: React.FocusEvent<HTMLInputElement, Element>) => any;
  placeholder: string;
  value: any;
  defaultValue: any;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value.replace("e", "");
    if (e.target.value) {
      if (!props.allowNegative && e.target.valueAsNumber <= 0) {
        e.target.value = "0";
      }
    } else {
      e.target.value = "";
    }
    props.onChange(e);
  };

  return (
    <input
      className={props.className ? props.className : ""}
      onBlur={(e) => props.validationFn && props.validationFn(e)}
      placeholder={props.placeholder}
      type="number"
      value={props.value || props.defaultValue || ""}
      onChange={(e) => handleChange(e)}
    />
  );
}
