import React, { useEffect, useMemo, useState } from "react";
import Form from "../Components/Inputs/Form";
import { useGetAllVenuesQuery } from "../Redux/API/PublicAPI";
import { TH_DEFAULT_DEALS } from "../Helpers/configConstants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { formUpdate, removeFormField } from "../Redux/User/UserSlice";
import { Venue } from "../Helpers/shared/Models/Venue";

export default function PaymentAgreementBuilder(props: {
  venueID: string;
  form: string;
}) {
  const venues = useGetAllVenuesQuery();
  const venue = venues[props.venueID as keyof typeof venues] as Venue;
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.user.forms[props.form]);

  const dealOptions = useMemo(
    () => ({
      ...TH_DEFAULT_DEALS,
      ...venue?.dealProfiles,
    }),
    [venue?.dealProfiles]
  );
  const [selectedDeal, setSelectedDeal] = useState(dealOptions["default"]);
  const [agreementTypeMap, setAgreementTypeMap] = useState({});
  const generatePaymentTypeMap = () => {
    let optionMap: { [key: string]: any } = {};
    Object.keys(dealOptions).forEach((option) => {
      optionMap[option] = dealOptions[option].label;
    });
    return optionMap;
  };

  useEffect(() => {
    setSelectedDeal(dealOptions[form["meta.selectedDeal"]]);
  }, [form["meta.selectedDeal"]]);

  useEffect(() => {
    dispatch(
      formUpdate({
        form: props.form,
        field: "deal.type",
        value: selectedDeal.type,
      })
    );
    selectedDeal.defaults &&
      Object.keys(selectedDeal.defaults).forEach((defaultKey) => {
        dispatch(
          formUpdate({
            form: props.form,
            field: `deal.defaults.${defaultKey}`,
            value: selectedDeal.defaults[defaultKey],
          })
        );
      });
    return () =>
      selectedDeal.defaults &&
      Object.keys(selectedDeal.defaults).forEach((defaultKey) => {
        dispatch(
          removeFormField({
            form: props.form,
            field: `deal.defaults.${defaultKey}`,
          })
        );
      });
  }, [selectedDeal]);

  useEffect(() => {
    setAgreementTypeMap(generatePaymentTypeMap());
  }, []);

  return (
    <>
      <Form
        keepOnDismount={true}
        name={props.form}
        formMap={[
          [
            {
              field: "meta.selectedDeal",
              fieldType: "dropdown",
              optionMap: agreementTypeMap,
              defaultValue: selectedDeal.name,
            },
            {
              prerequisite: selectedDeal?.options?.includes("guarantee"),
              field: "deal.defaults.guarantee",
              fieldType: "number",
              placeholder: "Guarantee Amount",
            },
            {
              prerequisite: selectedDeal?.options?.includes("production_fee"),
              field: "deal.defaults.production_fee",
              fieldType: "number",
              placeholder: "Production Fee",
            },
            // {
            //   prerequisite: selectedDeal?.options?.length > 0,
            //   field: "meta.saveDeal",
            //   fieldType: "toggleSlider",
            //   placeholder: "Save Deal Profile",
            // },
          ],
        ]}
        noSubmit
      />
    </>
  );
}
