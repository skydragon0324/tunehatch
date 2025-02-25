import React, { useRef, useState } from "react";

export default function Textarea(props: {
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => any;
  placeholder?: string;
  large?: any;
  classes?: any;
  className?: any;
  error?: any;
  value?: any;
}) {
  // const [oldHeight, setOldHeight] = useState<string | number>(0);
  const [height, setHeight] = useState<string | number>("auto");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  //weird workaround for ensuring the textbox autosizes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 2 + "px";
      if (Number(textareaRef.current.style.height.replace("px", "")) < 48) {
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + 48 + "px";
      }
    }
    props.onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={3}
      style={{ height: height }}
      onBlur={(e) => props?.onBlur(e)}
      onChange={(e) => handleChange(e)}
      onKeyDown={(e) => props.onKeyDown && props.onKeyDown(e)}
      name={props.placeholder}
      className={`resize-none w-full ${
        props.large ? "text-3xl font-black" : "text-lg"
      }
    ${props.classes ? props.classes : ""} ${
        props.className ? props.className : ""
      } 
 border-b-2 p-1 max-w-full rounded focus:border-orange ${
   props.error ? "border-red-400" : ""
 } peer`}
      placeholder={props.placeholder}
      value={props.value || ""}
    ></textarea>
  );
}
