import { SelectField, SelectOption } from "@dashlane/design-system";
import { forwardRef, useMemo } from "react";
interface Option {
  value: string;
  label: string;
}
interface CountryFieldProps {
  label: string;
  name?: string;
  value: string;
  placeholder: string;
  options: Option[];
  disabled: boolean;
  dataName?: string;
  onChange: (value: string) => void;
}
export const CountryField = forwardRef<HTMLInputElement, CountryFieldProps>(
  (
    {
      label,
      name,
      value,
      placeholder,
      options,
      disabled,
      dataName = "localeFormat",
      onChange,
    }: CountryFieldProps,
    ref
  ) => {
    const selectOptions = useMemo(
      () =>
        options.map((option: Option) => {
          return (
            <SelectOption key={option.value} value={option.value}>
              {option.label}
            </SelectOption>
          );
        }),
      [options]
    );
    return (
      <SelectField
        key="country"
        ref={ref}
        name={name}
        label={label}
        placeholder={placeholder}
        data-name={dataName}
        value={value}
        onChange={onChange}
        readOnly={disabled}
      >
        {selectOptions}
      </SelectField>
    );
  }
);
CountryField.displayName = "CountryField";
