import React from "react";
import { Field, FieldProps, useFormikContext } from "formik";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../../space-select/space-select";
interface Props {
  name: string;
  disabled?: boolean;
  contentCardLabel?: string;
  wrapInContentCard?: boolean;
}
const SpaceFieldComponent = ({
  name,
  disabled,
  contentCardLabel,
  wrapInContentCard,
}: Props) => {
  const { setFieldValue } = useFormikContext();
  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <SpaceSelect
          isUsingNewDesign
          labelSx={spaceSelectFormLabelSx}
          spaceId={field.value ?? ""}
          onChange={(newSpaceId) => {
            setFieldValue(name, newSpaceId);
          }}
          disabled={disabled}
          contentCardLabel={contentCardLabel}
          wrapInContentCard={wrapInContentCard}
        />
      )}
    </Field>
  );
};
export const SpaceField = React.memo(SpaceFieldComponent);
