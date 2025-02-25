import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { formUpdate, removeFormField } from "../../Redux/User/UserSlice";
import ToggleSlider from "./InputTypes/ToggleSlider";
import Textarea from "./InputTypes/Textarea";
import NumberField from "./InputTypes/Number";
import ButtonToggle from "./InputTypes/ButtonToggle";
// import Button from "../Buttons/Button";
import Dropdown from "./InputTypes/Dropdown";
import PlaceAutoComplete from "./InputTypes/PlaceAutoComplete";
import TimestampPicker from "../TimestampPicker";
import ButtonSelectGroup from "./InputTypes/ButtonSelectGroup";
import FilterInput from "./InputTypes/FilterInput";
import FileUpload from "./InputTypes/FileUpload/FileUpload";
import List from "./InputTypes/List/List";
// import ImageArrayUploader from "./InputTypes/MediaUpload/ImageArrayUploader";
import AltImageArrayUploader from "./InputTypes/MediaUpload/AltImageArrayUploader";

export default function FormInput(props: any) {
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(
    props.clickToEnable && !form?.[props.field] && !props.defaultValue
      ? false
      : true
  );

  const dispatch = useAppDispatch();
  const updateForm = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | string
      | boolean
  ) => {
    if (props.prerequisite !== false) {
      if (props.pendingState === "completed") {
        props.clearPendingState();
      }
      if (
        props.fieldType === "toggleSlider" ||
        props.fieldType === "buttonToggle" ||
        props.fieldType === "buttonSelectGroup" ||
        props.fieldType === "dropdown"
      ) {
        dispatch(
          formUpdate({ form: props.form, field: props.field, value: e })
        );
      } else {
        dispatch(
          formUpdate({
            form: props.form,
            field: props.field,
            value:
              typeof e === "string" || typeof e === "boolean"
                ? e
                : e.target.value,
          })
        );
      }
    } else if (form[props.field] !== undefined) {
      dispatch(removeFormField({ form: props.form, field: props.field }));
    }
  };

  useEffect(() => {
    if (
      props.prerequisite !== false &&
      props.fieldType !== "button" &&
      props.fieldType !== "timestamp" &&
      props.fieldType !== "file"
    ) {
      dispatch(
        formUpdate({
          form: props.form,
          field: props.field,
          value:
            form?.[props.field] !== null &&
            form?.[props.field] !== undefined &&
            form?.[props.field] !== "" &&
            (!Array.isArray(form?.[props.field]) ||
              form?.[props.field]?.length > 0)
              ? form[props.field]
              : props.defaultValue || "",
        })
      );
    }
  }, [props.defaultValue]);

  useEffect(() => {
    if (
      props.prerequisite !== false &&
      props.fieldType !== "button" &&
      props.fieldType !== "timestamp" &&
      props.fieldType !== "file"
    ) {
      dispatch(
        formUpdate({
          form: props.form,
          field: props.field,
          value:
            form?.[props.field] !== null &&
            form?.[props.field] !== undefined &&
            (!Array.isArray(form?.[props.field]) ||
              form?.[props.field]?.length > 0)
              ? form[props.field]
              : props.defaultValue || "",
        })
      );
    } else if (
      form?.[props.field] !== undefined &&
      props.fieldType !== "timestamp"
    ) {
      dispatch(removeFormField({ form: props.form, field: props.field }));
    }
  }, [props.prerequisite]);
  useEffect(() => {
    if (enabled === false) {
      dispatch(removeFormField({ form: props.form, field: props.field }));
    }
  }, [enabled]);
  const checkValidation = (e: any) => {
    if (!e.target.value && props.required) {
      setError(e.target.name + " is required");
    } else {
      setError("");
    }
  };

  return (
    // Title Logic is handled in Form.tsx
    props.prerequisite !== false && (
      // Container Class Logic, label reveal logic
      <div
        className={`flex max-w-full relative group transition-all items-end ${
          props.hidden ? "hidden" : ""
        } ${
          // (((form?.[props.field] || props.value) &&
          ((props.fieldType !== "toggleSlider" &&
            props.fieldType !== "buttonToggle") ||
            props.fieldType === "timestamp") &&
          props.label !== false
            ? "pt-4"
            : ""
        } ${props.containerClassName ? props.containerClassName : ""}`}
      >
        {props.clickToEnable && !enabled ? (
          // ClickToEnable Logic
          <>
            <button
              className="flex items-center h-9 border border-gray-200 hover:bg-gray-200 rounded-md m-1 ml-0 justify-center text-gray-700 w-full"
              onClick={(e) => {
                e.preventDefault();
                setEnabled(true);
              }}
            >
              <i className="material-symbols-outlined text-md">
                {props.icon || "add"}
              </i>
              {props.label !== false && (
                <p className="text-lg">
                  {error || props.label || props.placeholder}
                </p>
              )}
            </button>
          </>
        ) : (
          // Type Options Start
          <>
            {(!props.fieldType || props.fieldType === "text") && (
              // Text input
              <input
                onBlur={(e) => checkValidation(e)}
                name={props.name || props.placeholder}
                className={`${
                  props.large ? "text-3xl font-black" : "h-10 text-lg"
                }
         border-b-2 p-1 max-w-full w-full rounded focus:border-orange peer ${
           error ? "border-2 border-red-400" : ""
         } ${props.className ? props.className : ""}`}
                placeholder={props.placeholder}
                type={props.type}
                onChange={(e) =>
                  props.onChange ? props.onChange(e) : updateForm(e)
                }
                value={props.value || form?.[props.field] || ""}
              />
            )}
            {props.fieldType === "place" && (
              // Place Autocomplete Logic
              <PlaceAutoComplete
                form={props.form}
                field={props.field}
                metaField={props.metaField}
                defaultValue={props.defaultValue}
                locationTypes={props.locationTypes}
                className={props.className}
                containerClassName={props.containerClassName}
              />
            )}
            {props.fieldType === "button" && (
              // Form Button Logic
              <button
                className="flex items-center h-9 border border-gray-200 hover:bg-gray-200 rounded-md m-1 ml-0 justify-center text-gray-700 w-full"
                onClick={(e) => {
                  e.preventDefault();
                  props.clickFn();
                }}
              >
                <i className="material-symbols-outlined text-md">
                  {props.icon}
                </i>
                {props.label !== false && (
                  <p className="text-md font-bold">
                    {error || props.label || props.placeholder}
                  </p>
                )}
              </button>
            )}
            {props.fieldType === "textarea" && (
              // Textarea Logic
              <Textarea
                {...props}
                onChange={(e) => updateForm(e)}
                onBlur={(e) => checkValidation(e)}
                value={form?.[props.field] || ""}
                className={
                  props.className
                    ? props.className
                    : "" + error
                    ? "border-red-400"
                    : ""
                }
              />
            )}
            {props.fieldType === "toggleSlider" && (
              // Toggle Slider Logic
              <ToggleSlider
                // name={props.placeholder}
                label={error || props.label || props.placeholder}
                className={props.className + " peer"}
                clickFn={(e) => updateForm(e)}
                value={form?.[props.field]}
              />
            )}
            {props.fieldType === "buttonToggle" && (
              // Button Toggle Logic
              <ButtonToggle
                // name={props.placeholder}
                label={error || props.label || props.placeholder}
                className={props.className}
                clickFn={(e) => updateForm(e)}
                value={form?.[props.field]}
                form={props.form}
                warnWhenData={props.warnWhenData}
                warnMessage={props.warnMessage}
              />
            )}
            {props.fieldType === "dropdown" && (
              // Dropdown Logic
              <Dropdown
                {...props}
                className={props.className}
                value={form?.[props.field]}
                defaultValue={props.defaultValue}
                useSelectionColor={props.useSelectionColor}
                colorMap={props.colorMap}
                onChange={(e) => updateForm(e)}
                optionMap={props.optionMap}
              />
            )}
            {props.fieldType === "number" && (
              // Number Logic
              <NumberField
                {...props}
                onChange={(e) => updateForm(e)}
                className={`h-10 text-lg border-b-2 p-1 max-w-full rounded peer focus:border-orange
                 ${error ? "border-red-400" : ""}
                 ${props.classes} ${props.className}
                 `}
                defaultValue={undefined}
                validationFn={(e) => checkValidation(e)}
                value={form?.[props.field] === undefined ? props.defaultValue : form[props.field]}
              />
            )}
            {props.fieldType === "timestamp" && (
              // Timestamp Logic
              <div className="pt-2 w-full">
                <TimestampPicker
                  form={props.form}
                  field={props.field}
                  label={error || props.label}
                  allowPast={props.allowPast}
                  defaultValue={props.defaultValue}
                  mustBeAfter={props.mustBeAfter}
                  mustBeBefore={props.mustBeBefore}
                  offset={props.offset}
                  // onChange={(e) => updateForm(e)}
                />
              </div>
            )}
            {props.fieldType === "buttonSelectGroup" && (
              // Button Select Group Logic
              <ButtonSelectGroup
                value={form[props.field]}
                form={props.form}
                field={props.field}
                optionMap={props.optionMap}
                triggerPageChange={props.triggerPageChange}
                nextPageFn={() => props.nextPageFn()}
                onClick={(e) => {
                  updateForm(e);
                }}
              />
            )}
            {props.fieldType === "filterInput" && (
              // Filter Input logic
              <FilterInput
                className={props.className ? props.className : ""}
                type={props.filterType}
                placeholder={props.placeholder}
                selectFn={props.selectFn}
                removeFn={props.removeFn}
                limit={props.limit}
                value={props.value || []}
                defaultValue={props.defaultValue}
                form={props.form}
                field={props.field}
              />
            )}
            {props.fieldType === "file" && (
              // File Upload Logic
              <FileUpload
                // className={props.className ? props.className : ""}
                // type={props.type}
                // placeholder={props.placeholder}
                // onChange={props.onChange}
                limit={props.limit}
                defaultValue={props.defaultValue || []}
                form={props.form}
                field={props.field}
              />
            )}
            {
              // props.fieldType === "image" && (
              //   <ImageArrayUploader
              //     limit={props.limit}
              //     defaultImages={props.defaultValue || []}
              //     form={props.form}
              //     field={props.field}
              //   />
              // )
            }
            {props.fieldType === "imageArray" && (
              <AltImageArrayUploader
                limit={props.limit}
                defaultImages={props.defaultValue || []}
                form={props.form}
                field={props.field}
              />
            )}
            {props.fieldType === "list" && (
              // List Logic
              <List
                className={props.className}
                listItems={props.defaultValue || []}
                form={props.form}
                field={props.field}
              />
            )}
            {
              //Type Options End */
            }
            {props.fieldType !== "toggleSlider" &&
              props.fieldType !== "buttonToggle" &&
              props.fieldType !== "buttonSelectGroup" &&
              props.label !== false && (
                // Standard Label Logic
                <p
                  className={`peer-focus:text-orange absolute text-sm transition-all top-0 ${
                    form?.[props.field] ||
                    props.value ||
                    props.fieldType === "timestamp" ||
                    true === true
                      ? //logic for always visible labels
                        "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <span className="pl-1">
                    {error || props.label || props.placeholder}
                  </span>
                </p>
              )}
          </>
        )}
        {props.clickToEnable && enabled && (
          // ClickToEnable Cancel Logic
          <div className="h-10 right-0 absolute flex items-center">
            <i
              className="material-symbols-outlined"
              onClick={() => setEnabled(false)}
            >
              close
            </i>
          </div>
        )}
      </div>
    )
  );
}
