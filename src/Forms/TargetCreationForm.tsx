import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { FormKeys, formArrayUpdate } from "../Redux/User/UserSlice";
// import FormInput from "../Components/Inputs/FormInput";
import Form from "../Components/Inputs/Form";
import Img from "../Components/Images/Img";

export default function TargetCreationForm(props: {
  form?: FormKeys;
  field?: string;
  index?: string | number;
  type?: string;
  className?: string;
  src?: string;
  cancelFn: (arg: number | string) => any;
}) {
  const dispatch = useAppDispatch();
  const form = useAppSelector(
    (state) => state.user.forms[props.form][props.field]?.[props.index]
  );
  const [minimized, setMinimized] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      formArrayUpdate({
        form: props.form,
        field: props.field,
        index: props.index,
        value: {
          [e.target.name]: e.target.value,
        },
      })
    );
    e.target.focus();
  };

  useEffect(() => {
    form &&
      dispatch(
        formArrayUpdate({
          form: props.form,
          field: props.field,
          index: props.index,
          value: {
            type: props.type,
          },
        })
      );
  }, []);

  return (
    form && (
      <div
        className={`w-full flex-wrap border relative ${
          minimized ? "rounded-full p-0" : "p-2 rounded-lg"
        }`}
      >
        <div
          className={
            "flex mt-1 justify-center border rounded-lg overflow-hidden pr-2 flex-col " +
            props.className
              ? props.className
              : ""
          }
        >
          <div className="flex items-center">
            <Img
              className="w-8 h-8 mr-1 border border-orange rounded-full"
              src={props.src}
            />{" "}
            <p>{form?.name}</p>
            <i
              onClick={() => {
                if (minimized) {
                  setMinimized(false);
                } else {
                  props.cancelFn && props.cancelFn(props.index);
                  // dispatch(removeFormArray({index: props.index, form: props.form, field: props.field}))
                }
              }}
              className={`float-right relative ml-auto material-symbols-outlined ${
                minimized ? "text-blue-400" : "text-red-400"
              } text-base pl-1 pr-2`}
            >
              {minimized ? "edit" : "close"}
            </i>
          </div>
          <div className="w-full">
            {minimized ? null : props.type === "venue" ? (
              <Form
                name={null}
                className="p-2 mt-1"
                formMap={[
                  [
                    {
                      fieldType: "title",
                      key: "title",
                      className: "text-center text-xs",
                      defaultValue: (
                        <>
                          {form?.name ? form.name : "This venue"} is not yet on
                          TuneHatch. Please enter their information to generate
                          their Venue Profile.
                          <br />
                        </>
                      ),
                    },
                    {
                      placeholder: "Venue Name",
                      name: "name",
                      key: "name",
                      containerClassName: "bg-transparent",
                      className: "w-full bg-transparent",
                      value: form?.name,
                      required: true,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e),
                    },
                    {
                      placeholder: "Email",
                      name: "email",
                      key: "email",
                      type: "email",
                      className: "w-full bg-transparent",
                      value: form?.email,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e),
                    },
                    {
                      fieldType: "button",
                      containerClassName: "mt-1",
                      key: "button",
                      className: "w-full text-black",
                      label: "Done",
                      clickFn: () => setMinimized(true),
                    },
                  ],
                ]}
                noSubmit
              />
            ) : (
              <Form
                name={null}
                className="p-2 mt-1"
                formMap={[
                  [
                    {
                      fieldType: "title",
                      key: "title",
                      className: "text-center text-xs",
                      defaultValue: (
                        <>
                          {form?.name ? form.name : "This artist"} is not yet on
                          TuneHatch. Please enter their information to generate
                          their Artist Profile.
                          <br />
                        </>
                      ),
                    },
                    {
                      placeholder: "Stage Name",
                      name: "name",
                      key: "name",
                      containerClassName: "bg-transparent",
                      className: "w-full bg-transparent",
                      value: form?.name,
                      required: true,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e),
                    },
                    {
                      placeholder: "Email",
                      name: "email",
                      key: "email",
                      type: "email",
                      className: "w-full bg-transparent",
                      value: form?.email,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e),
                    },
                    {
                      fieldType: "button",
                      containerClassName: "mt-1",
                      key: "button",
                      className: "w-full text-black",
                      label: "Done",
                      clickFn: () => setMinimized(true),
                    },
                  ],
                ]}
                noSubmit
              />
            )}
          </div>
        </div>
      </div>
    )
  );
}
