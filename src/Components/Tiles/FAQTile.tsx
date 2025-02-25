import React, { useState } from "react";

function FAQTile(props: {
  question?: string | React.ReactNode;
  answer?: string | React.ReactNode;
}) {
  const [opened, toggle] = useState(false);
  return (
    <div
      className=" m-2 bg-white w-50 text-sm rounded-lg"
      onClick={() => {
        toggle(!opened);
      }}
    >
      <div className="flex items-center p-2">
        <span className="w-10 flex-shrink-0 material-symbols-outlined">
          {opened ? "remove" : "add"}
        </span>

        <p className="text-left font-medium"> {props.question}</p>
      </div>
      {opened && (
        <div>
          <p className="p-5 pt-3">{props.answer}</p>
        </div>
      )}
    </div>
  );
}

export default FAQTile;
