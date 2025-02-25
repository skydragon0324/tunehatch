import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import {
  formArrayUpdate,
  formSplice,
  removeFormArray,
} from "../../../../Redux/User/UserSlice";
import Textarea from "../Textarea";

export default function ListItem(props: {
  form: string;
  field: string;
  className?: string;
  value?: string;
  index?: number;
  editMode?: boolean;
  onDelete?: any;
}) {
  const dispatch = useAppDispatch();
  const [editedValue, setEditedValue] = useState(props.value);
  const [editMode, setEditMode] = useState(props.editMode);

  useEffect(() => {
    setEditedValue(props.value);
  }, [props.value]);

  // useEffect(() => {
  //   setEditedValue(props.value);
  // }, [props.value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const updatedValue = e.target.value;
    setEditedValue(updatedValue);

    // Use the callback function to ensure the latest state value
    // setEditedValue((prevValue) => {
      dispatch(
        formArrayUpdate({
          index: props.index,
          form: props.form,
          field: props.field,
          value: updatedValue,
        })
      );
      return updatedValue;
    // });
  };

  const handleEdit = () => {
    console.log("handle edit", editedValue);
    console.log(props.index, props.form, props.field);
    dispatch(
      formArrayUpdate({
        index: props.index,
        form: props.form,
        field: props.field,
        value: editedValue,
      })
    );
    setEditMode(false);
    setEditedValue(editedValue);
  };

  const handleRemove = () => {
    console.log("handle remove");

    dispatch(
      formSplice({
        form: props.form,
        field: props.field,
        index: props.index,
        value: props.value,
      })
    );
    if (props.onDelete) {
      props.onDelete(props.index);
    }
  };

  return (
    <>
      <div
        className={`${
          props.className
            ? props.className
            : "flex w-full border gap-2 mb-1 p-2 items-center"
        }`}
      >
        {editMode ? (
          <>
            <Textarea
              className="flex-grow border-none"
              onKeyDown={(e) => e.key === "Enter" && setEditMode(false)}
              onChange={(e) => handleChange(e)}
              value={editedValue}
            />
            <i
              onClick={handleEdit}
              className="material-symbols-outlined text-green-400"
            >
              done
            </i>
          </>
        ) : (
          <>
            <div className="flex-grow max-w-full whitespace-pre-line flex">
              <p className="w-full">{props.value}</p>
            </div>
            <i
              onClick={() => setEditMode(true)}
              className="material-symbols-outlined text-blue-400"
            >
              edit
            </i>
            <i
              onClick={() => handleRemove()}
              className="material-symbols-outlined text-red-400"
            >
              close
            </i>
          </>
        )}
      </div>
    </>
  );
}
