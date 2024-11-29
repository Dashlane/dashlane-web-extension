import { useState } from "react";
import {
  Icon,
  IndeterminateLoader,
  SelectField,
  SelectOption,
} from "@dashlane/design-system";
import { transformUnknownErrorToErrorMessage } from "../../../helpers";
interface Props {
  label: string;
  value: string;
  isReadOnly?: boolean;
  options: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
  saveValueFunction: (value: string) => Promise<void>;
  successMessage: string;
  savingMessage: string;
}
export const SelectWithFeedback = ({
  label,
  value,
  isReadOnly,
  options,
  saveValueFunction,
  successMessage,
  savingMessage,
}: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSavingField, setIsSavingField] = useState(false);
  const [showSaveFieldFeedbackMessage, setShowSaveFieldFeedbackMessage] =
    useState(false);
  const handleSelectValue = (selectValue: string) => {
    setIsSavingField(true);
    saveValueFunction(selectValue)
      .then(() => {
        setIsSavingField(false);
        setShowSaveFieldFeedbackMessage(true);
        setErrorMessage("");
        setTimeout(() => {
          setShowSaveFieldFeedbackMessage(false);
        }, 1000);
      })
      .catch((error) => {
        setIsSavingField(false);
        setShowSaveFieldFeedbackMessage(false);
        const selectErrorMessage = transformUnknownErrorToErrorMessage(error);
        setErrorMessage(selectErrorMessage);
      });
  };
  const getFieldDisabledStatus = (): boolean => {
    return isReadOnly ?? isSavingField;
  };
  const shouldShowErrorMessage = errorMessage ? errorMessage : "";
  const shouldShowSavingMessage = isSavingField
    ? savingMessage
    : shouldShowErrorMessage;
  return (
    <div
      sx={{
        position: "relative",
        display: "flex",
        gap: "8px",
      }}
    >
      <div sx={{ width: "100%" }}>
        <SelectField
          label={label}
          value={value === "" ? "disabled" : value}
          disabled={getFieldDisabledStatus()}
          readOnly={isReadOnly}
          onChange={handleSelectValue}
          labelPersists={false}
          feedback={{
            text: showSaveFieldFeedbackMessage
              ? successMessage
              : shouldShowSavingMessage,
          }}
          error={!!errorMessage}
        >
          {options.map((option) => (
            <SelectOption
              key={option.label}
              value={option.value}
              disabled={!!option.disabled}
            >
              {option.label}
            </SelectOption>
          ))}
        </SelectField>
      </div>
      {isSavingField || showSaveFieldFeedbackMessage ? (
        <div
          sx={{
            display: "flex",
            height: "48px",
            alignItems: "center",
          }}
        >
          {isSavingField ? (
            <IndeterminateLoader mood="positive" size={24} />
          ) : (
            <Icon
              name="FeedbackSuccessOutlined"
              color="ds.text.positive.quiet"
              size="large"
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
