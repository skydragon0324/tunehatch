import React, { useEffect, useState } from "react";
import { getDisplayName } from "../../../../Helpers/HelperFunctions";
import { Type } from "../../../../Helpers/shared/Models/Type";
import TargetLabel from "../../../Buttons/TargetLabel";
import { useAppDispatch } from "../../../../hooks";
import {
  FormKeys,
  // formAppend,
  formUpdate,
} from "../../../../Redux/User/UserSlice";
import TargetCreationForm from "../../../../Forms/TargetCreationForm";

export default function FilterInputDisplay(props: {
  data?: any[];
  limit?: number;
  className?: string;
  searchParams?: string[];
  placeholder?: string;
  large?: boolean;
  error?: string;
  field?: string;
  onSelect?: any;
  type: Type;
  addOffPlatform?: boolean;
  selectFn?: any;
  removeFn?: any;
  value?: any[];
  defaultValue?: any[] | undefined | null;
  dataObject?: { [key: string]: any };
  form?: FormKeys;
}) {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [value, updateValue] = useState(props.value);

  useEffect(() => {
    dispatch(
      formUpdate({
        form: props.form,
        field: props.field,
        value: props.defaultValue || props.value,
      })
    );
  }, []);

  const handleSelect = (result: { [key: string]: any }) => {
    setQuery("");
    props.selectFn &&
      props.selectFn({
        id: result._key,
        name: result.name || getDisplayName(props.type, result),
      });
  };

  useEffect(() => {
    let allResults: { [key: string]: any }[] = [];
    var seen: { [key: string]: any } = {};
    if (query) {
      for (const param of props.searchParams) {
        let searchFilter = new RegExp(query, "gi");
        allResults = [
          ...allResults,
          ...props.data.filter((entry) => {
            if (String(entry[param]).match(searchFilter) && entry[param]) {
              return seen.hasOwnProperty(entry._key)
                ? false
                : (seen[entry._key] = true);
            }
          }),
        ];
      }
    }
    setResults(allResults);
  }, [query]);

  useEffect(() => {
    if (props.value.length !== value.length) {
      updateValue(props.value);
    }
  }, [props.value]);

  return (
    <div
      className={`relative peer z-10 ${props.className ? props.className : ""}`}
    >
      <input
        name={props.placeholder}
        disabled={props.limit && props.value.length >= props.limit}
        className={`${props.large ? "text-3xl font-black" : "h-10 text-lg"}
        border-b-2 p-1 max-w-full w-full rounded focus:border-orange peer 
        ${props.error ? "border-red-400" : ""}`}
        placeholder={props.placeholder}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div className="flex w-full flex-wrap gap-1">
        {value?.map((target, i) => {
          if (target?.id !== 0) {
            return (
              <TargetLabel
                key={target?.name + "/" + i}
                canCancel
                cancelFn={() => {
                  props.removeFn(target);
                }}
                name={
                  target && (target?.name || props.dataObject?.[target?.id])
                    ? target?.name ||
                      getDisplayName(props.type, props.dataObject?.[target?.id])
                    : ""
                }
                src={props.dataObject?.[target?.id]?.avatar}
              />
            );
          } else {
            return (
              <div className="flex flex-col order-1 mt-1">
                <TargetCreationForm
                  form={props.form}
                  key={target?.name + "/" + i}
                  field={props.field}
                  index={i}
                  type={props.type}
                  // label={
                  //   <TargetLabel
                  //     className="flex-shrink justify-left"
                  //     canCancel
                  //   />
                  // }
                  cancelFn={() => {
                    props.removeFn(target);
                  }}
                />
              </div>
            );
            // <TargetLabel className="order-last" canCancel name={`Off-Platform ${props.type}: ${target.name}`} cancelFn={() => {
            //     props.removeFn(target)}}/>
          }
        })}
      </div>
      <div className="absolute hidden hover:block focus:block peer-focus:block top-10 max-h-64 overflow-scroll bg-white w-full">
        {results.map((result, i) => {
          return (
            <div
              key={i}
              onClick={() => handleSelect(result)}
              className="w-full p-2 hover:bg-gray-200"
            >
              <p>{getDisplayName(props.type, result)}</p>
            </div>
          );
        })}
        {query && (
          <div
            onClick={() => handleSelect({ _key: 0, name: query })}
            className="w-full p-2 hover:bg-gray-200"
          >
            <p>
              Off-Platform {props.type}: {query}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
