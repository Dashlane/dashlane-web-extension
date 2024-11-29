import * as React from "react";
import { Field, FieldProps } from "formik";
import { TextField, TextFieldProps } from "@dashlane/design-system";
const TextInputFieldComponent = (
  { name, ...textFieldProps }: TextFieldProps,
  ref: React.Ref<HTMLInputElement>
) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <TextField
          key={field.name}
          {...textFieldProps}
          {...field}
          error={meta.error !== undefined}
          ref={ref}
        />
      )}
    </Field>
  );
};
const TextInputFieldRef = React.forwardRef<HTMLInputElement, TextFieldProps>(
  TextInputFieldComponent
);
export const TextInputField = React.memo(TextInputFieldRef);
