import React, { ChangeEvent } from "react";
import { DateField as DSDateField } from "@dashlane/design-system";
import { Field, FieldProps, useFormikContext } from "formik";
interface Props {
  name: string;
  label: string;
  calendarButtonLabel: string;
  disabled?: boolean;
}
const DateFieldComponent = ({
  name,
  label,
  disabled,
  calendarButtonLabel,
}: Props) => {
  const { setFieldValue } = useFormikContext();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setFieldValue(name, event.target.value === "" ? null : event.target.value);
  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <DSDateField
          name={name}
          value={`${field.value ?? ""}`}
          label={label}
          onChange={handleChange}
          disabled={disabled}
          calendarButtonLabel={calendarButtonLabel}
        />
      )}
    </Field>
  );
};
export const DateField = React.memo(DateFieldComponent);
