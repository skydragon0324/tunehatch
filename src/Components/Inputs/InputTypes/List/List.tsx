import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import { useAppDispatch } from "../../../../hooks";
import { formAppend } from "../../../../Redux/User/UserSlice";
import IconButton from "../../../Buttons/IconButton";

export default function List(props: {
  listItems: any[];
  className?: string;
  addLabel?: any;
  listItemClassName?: string;
  form: string;
  field: string;
}) {
  const dispatch = useAppDispatch();
  const [initialLength, setInitialLength] = useState(0);

  useEffect(() => {
    if (!initialLength && props.listItems) {
      setInitialLength(props.listItems.length);
    }
  }, []);

  return (
    <>
      <div
        className={
          props.className ? props.className : "flex-col w-full justify-center"
        }
      >
        {props.listItems.map((item, i) => {
          return (
            <ListItem
              className={props.listItemClassName ? props.listItemClassName : ""}
              form={props.form}
              field={props.field}
              value={item}
              key={i}
              index={i}
              editMode={i + 1 > initialLength && props.listItems.length < i + 2}
            />
          );
        })}
        <IconButton
          icon="add"
          className={
            "w-1/2 mx-auto p-2 bg-orange hover:filter hover:brightness-105 transition-all text-white items-center flex justify-center rounded-full"
          }
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            dispatch(
              formAppend({ form: props.form, field: props.field, value: "" })
            );
          }}
        >
          {props.addLabel ? props.addLabel : "Add New Item"}
        </IconButton>
      </div>
    </>
  );
}
