import React from "react";
import { useFormikContext } from "formik";
import { TextInputField } from "./TextInputField";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { FiscalIdFormFields } from "../../types";
interface Props {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const TeledeclarantNumberFieldComponent = ({
  name,
  label,
  placeholder,
  disabled = false,
  handleCopy,
}: Props) => {
  const { setFieldValue, values } = useFormikContext<FiscalIdFormFields>();
  React.useEffect(() => {
    if (values.country !== "FR") {
      setFieldValue(name, "");
    }
  }, [name, setFieldValue, values.country]);
  if (values.country !== "FR") {
    return null;
  }
  return (
    <TextInputField
      name={name}
      label={label}
      placeholder={placeholder}
      actions={
        handleCopy
          ? [
              <CopyToClipboardButton
                key="copy"
                data={values[name]}
                onCopy={handleCopy}
              />,
            ]
          : undefined
      }
      disabled={disabled}
    />
  );
};
export const TeledeclarantNumberField = React.memo(
  TeledeclarantNumberFieldComponent
);
