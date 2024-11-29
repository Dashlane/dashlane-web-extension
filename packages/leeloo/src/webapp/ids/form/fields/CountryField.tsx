import React, { ChangeEventHandler, useCallback, useEffect } from "react";
import { Field, FieldProps } from "formik";
import { Country } from "@dashlane/communication";
import { CountryField as BaseCountryField } from "../../../components/fields/country-field";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { TranslateFunction } from "../../../../libs/i18n/types";
import { getDefaultOption } from "./SelectField";
const countryList = Object.keys(Country);
const getCountryOptions = (translate: TranslateFunction) => {
  const sorted = countryList
    .filter(
      (countryKey) =>
        !(
          Country[countryKey] === Country.UNIVERSAL ||
          Country[countryKey] === Country.NO_TYPE
        )
    )
    .map((countryKey) => ({
      label: translate(`country_name_${Country[countryKey]}`),
      value: Country[countryKey],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [getDefaultOption(translate, Country.UNIVERSAL), ...sorted];
};
interface Props {
  name: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const CountryFieldComponent = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
}: Props) => {
  const { translate } = useTranslate();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { current: options } = React.useRef(getCountryOptions(translate));
  const defaultOption = options[0];
  const triggerNativeChange = useCallback((newValue: string) => {
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, newValue);
      const changeEvent = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(changeEvent);
    }
  }, []);
  useEffect(() => {
    const currentInput = inputRef.current;
    currentInput?.addEventListener("input", onChange as any);
    return () => {
      currentInput?.removeEventListener("input", onChange as any);
    };
  }, [onChange]);
  return (
    <BaseCountryField
      ref={inputRef}
      placeholder={defaultOption.value}
      label={label}
      options={options}
      disabled={disabled}
      onChange={triggerNativeChange}
      name={name}
      value={value}
    />
  );
};
type FormikCountryProps = Omit<Props, "value" | "onChange">;
const FormikCountrySelect = (props: FormikCountryProps) => {
  return (
    <Field name={props.name}>
      {({ field }: FieldProps) => (
        <CountryFieldComponent {...props} {...field} />
      )}
    </Field>
  );
};
export const CountryField = React.memo(FormikCountrySelect);
