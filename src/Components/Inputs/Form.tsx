import React, { HTMLInputTypeAttribute, useEffect, useState } from "react";
import FormInput from "./FormInput";
import ViewController from "../Layout/ViewController";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { prepMediaFormData } from "../../Helpers/HelperFunctions";
import { addStatusMessage } from "../../Redux/UI/UISlice";
import { clearForm } from "../../Redux/User/UserSlice";
import FormComponentController from "./FormComponentController";

// TODO: PubGenius might need to extend this interface for all edge cases after which its safe to remove "any" from formMap prop
export interface FormMapProps {
  field?: string;
  fieldType?: string;
  defaultValue?: React.ReactNode;
  className?: string;
  placeholder?: string;
  prerequisite?: boolean;
  containerClassName?: string;
  required?: boolean;
  large?: boolean;
  classes?: string;
  type?: HTMLInputTypeAttribute;
  clickToEnable?: boolean;
  label?: string;
  optionMap?: { [key: string]: string };
  clickFn?: () => void;
  hidden?: boolean;
  form?: string;
  filterType?: string;
  value?: string;
  selectFn?: (e: any) => void;
  removeFn?: (e: any) => void;
  metaField?: string;
  locationTypes?: any[];
  icon?: string;
  limit?: number;
  component?: string;
  componentProps?: { [key: string]: any };
  key?: string;
  mustMatch?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prerequsite?: boolean;
}

export default function Form(props: {
  name: string;
  key?: string;
  formMap: FormMapProps[][];
  submitFn?: (data: any) => any;
  media?: boolean;
  fixedNav?: boolean;
  className?: string;
  doneLabel?: string;
  doneIcon?: string;
  navClassName?: string;
  completedLabel?: string;
  successStatusMessage?: string;
  onComplete?: () => void;
  clearOnComplete?: boolean;
  keepOnDismount?: boolean;
  optionMap?: any;
  noSubmit?: boolean;
  onChange?: (e: React.ChangeEvent<any>) => void;
  additionalAuthParams?: object;
  separateFormObject?: boolean;
  component?: any;
  componentProps?: object;
  locked?: boolean;
}) {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [locked, setLocked] = useState(true);
  // const [animating, animate] = useState("");
  const [pendingState, setPendingState] = useState("false");
  const [errors, setErrors] = useState("");
  const [displayErrors, toggleErrorDisplay] = useState(false);
  const [formMap, setFormMap] = useState(props.formMap);
  const additionalAuthParams = props.additionalAuthParams || {};
  const form = useAppSelector((state) => state.user.forms?.[props.name]);
  const SECRET_UID = useAppSelector((state) => state.user.data.uid);
  const displayUID = useAppSelector((state) => state.user.data.displayUID);
  useEffect(() => {
    return () => {
      if (!props.keepOnDismount) {
        dispatch(clearForm({ form: props.name }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.formMap) {
      setFormMap(props.formMap.filter((page: any[]) => page.length > 0));
    }
  }, [props.formMap]);

  const submitForm = async () => {
    var promise;
    setPendingState("true");
    let formData;
    if (props.media) {
      formData = prepMediaFormData(
        form,
        SECRET_UID,
        additionalAuthParams || null
      );
      promise = props.submitFn(formData);
    } else {
      formData = form;
      if (props.separateFormObject) {
        promise = props.submitFn({
          SECRET_UID,
          ...additionalAuthParams,
          id: displayUID,
          form: formData,
        });
      } else {
        promise = props.submitFn({
          SECRET_UID,
          ...additionalAuthParams,
          id: displayUID,
          ...formData,
        });
      }
    }
    try {
      await promise.unwrap();
      setPendingState("completed");
      props.successStatusMessage &&
        dispatch(
          addStatusMessage({
            type: "success",
            message: props.successStatusMessage,
          })
        );
      (await props.onComplete) && props.onComplete();
      props.clearOnComplete &&
        dispatch(clearForm({ form: props.name })) &&
        setPendingState("false");
    } catch (err) {
      setPendingState("error");
      dispatch(addStatusMessage({ type: "error", message: (err as any).data }));
    }
  };

  const changePage = (e: number) => {
    // animate("1s linear page-out")
    setPage(e);
    toggleErrorDisplay(false);
  };
  // useEffect(() => {
  // setTimeout(() => {
  //     setPage(e)
  //     console.log(animating);
  //     animate("in");
  // }, 1250)
  // }, [animating]);

  useEffect(() => {
    let tLocked = false;
    let errors: string[] = [];

    formMap[page].forEach((formElement: any) => {
      if (tLocked || !formElement.required) return;

      const formValue = form?.[formElement.field];
      const isPopulated =
        formValue != null &&
        ((!Array.isArray(formValue) && !!formValue) || formValue.length > 0);

      if (!isPopulated && formElement.prerequisite !== false) {
        errors.push(formElement.label || formElement.placeholder);
        tLocked = true;
      }
    });
    setLocked(tLocked);
    let tempString = "";
    errors.forEach((error, i) => {
      tempString = tempString + error;
      if (i !== errors.length - 1 && errors.length > 1) {
        if (errors.length !== 2) {
          tempString = tempString + ", ";
        } else {
          tempString = tempString + " ";
        }
        if (i === errors.length - 2 && errors.length > 1) {
          tempString = tempString + "and ";
        }
      } else {
        if (errors.length === 1) {
          tempString = tempString + " is a required field.";
        } else {
          tempString = tempString + " are required fields.";
        }
      }
    });
    if (errors.length === 0) {
      toggleErrorDisplay(false);
    }
    setErrors(tempString);
  }, [form, page]);

  return (
    <>
      {/* {animating} */}
      <div className="w-full h-full" onSubmit={(e) => e.preventDefault()}>
        {
          <div
            className={`transition-all ${
              displayErrors && errors
                ? "bg-gray-50 flex justify-center items-center text-red-400 text-sm rounded font-medium w-full text-center overflow-auto h-14 relative -mt-2 mb-4 p-2"
                : "h-0 mt-0"
            }`}
          >
            {
              <p
                className={`text-red-400 text-sm rounded font-medium w-full text-center ${
                  errors && displayErrors ? "opacity-100" : "opacity-0 h-0"
                }`}
              >
                {errors}
              </p>
            }
          </div>
        }
        <div className={`${props.className}`}>
          {formMap[page].map((formElement: any, i: number) => {
            return formElement.fieldType === "title" ||
              formElement.fieldType === "component" ? (
              <>
                {formElement.fieldType === "title" && (
                  <h2
                    key={`title/${i}`}
                    className={
                      `${
                        formElement.hidden || formElement.prerequisite === false
                          ? "hidden "
                          : ""
                      } ` + formElement.className
                    }
                  >
                    {formElement.value || formElement.defaultValue}
                  </h2>
                )}
                {formElement.fieldType === "component" &&
                  (formElement.prerequisite ||
                    formElement.prerequisite === undefined) && (
                    <div
                      className={`w-full ${
                        formElement.containerClassName
                          ? formElement.containerClassName
                          : ""
                      }`}
                    >
                      <FormComponentController
                        component={formElement.component}
                        componentProps={{
                          ...formElement.componentProps,
                          lockForm: (e: boolean) => setLocked(e),
                          lockStatus: locked,
                        }}
                      />
                    </div>
                  )}
              </>
            ) : (
              <FormInput
                form={formElement.form || props.name}
                key={formElement.key || props.name + "/" + formElement.field}
                field={formElement.field}
                metaField={formElement.metaField}
                name={formElement.name}
                fieldType={formElement.fieldType}
                type={formElement.type}
                placeholder={formElement.placeholder}
                label={formElement.label}
                onChange={formElement.onChange}
                icon={formElement.icon}
                warnWhenData={formElement.warnWhenData}
                warnMessage={formElement.warnMessage}
                clickFn={formElement.clickFn}
                classes={formElement.classes}
                className={formElement.className}
                large={formElement.large}
                prerequisite={formElement.prerequisite}
                clickToEnable={formElement.clickToEnable}
                hidden={formElement.hidden}
                required={formElement.required}
                value={formElement.value}
                allowPast={formElement.allowPast}
                defaultValue={formElement.defaultValue}
                clearPendingState={() => setPendingState("false")}
                pendingState={pendingState}
                containerClassName={formElement.containerClassName}
                optionMap={formElement.optionMap}
                mustBeAfter={formElement.mustBeAfter}
                mustBeBefore={formElement.mustBeBefore}
                nextPageFn={() => changePage(page + 1)}
                triggerPageChange={formElement.triggerPageChange}
                filterType={formElement.filterType}
                selectFn={formElement.selectFn}
                removeFn={formElement.removeFn}
                limit={formElement.limit}
                useSelectionColor={formElement.useSelectionColor}
                colorMap={formElement.colorMap}
                lockForm={(e: boolean) => setLocked(e)}
                locationTypes={formElement.locationTypes}
              />
            );
          })}
        </div>
        {!props.noSubmit && (
          <div className="w-full sticky bottom-0 pointer-events-none">
            <ViewController
              key={"viewController"}
              locked={props.locked || locked}
              navClassName={props.navClassName}
              fixed={props.fixedNav}
              currentView={page}
              displayErrors={() => toggleErrorDisplay(true)}
              changeFn={(e: number) => changePage(e)}
              doneLabel={props.doneLabel}
              pendingState={pendingState}
              submitFn={() => submitForm()}
              totalViews={formMap ? formMap?.length - 1 : 0}
              completedLabel={props.completedLabel}
            />
          </div>
        )}
      </div>
    </>
  );
}
