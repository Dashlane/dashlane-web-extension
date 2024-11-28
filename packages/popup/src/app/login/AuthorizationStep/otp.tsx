import {
  ChangeEvent,
  FormEvent,
  memo,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { InfoBox, jsx } from "@dashlane/ui-components";
import useId from "../../../libs/hooks/useId";
import useTranslate from "../../../libs/i18n/useTranslate";
import FormWrapper from "../FormWrapper";
import PinInput from "../../../components/inputs/login/PinInput";
import InputWithMessageWrapper, {
  MessageType,
} from "../../../components/inputs/login/InputWithMessageWrapper";
import { FormActionsProps } from "../FormWrapper/FormActions";
import { ThemeEnum } from "../../../libs/helpers-types";
import styles from "./styles.css";
const OTP_MAX_LENGTH = 6;
const COMPLETE_OTP_EXP = RegExp(`^[0-9]{${OTP_MAX_LENGTH}}$`);
const codeLabelId = "code";
const I18N_KEYS = {
  SYNC_DEVICES_TIME_INFOBOX: "login/otp_sync_devices_time_infobox",
};
export interface OTPStepProps {
  titleCopy: string;
  descriptionCopy: string;
  handleCodeSubmit: (code: string) => void;
  resetErrorState: () => void;
  error?: string;
  onInputFocus?: () => void;
  formActionsProps: FormActionsProps;
  codeValue: string;
  setCodeValue: (code: string) => void;
  showSyncDevicesHelp?: boolean;
  formDetails?: ReactNode;
}
const OTPStep = (props: OTPStepProps) => {
  const { translate } = useTranslate();
  const [primaryButtonIsDisabled, setPrimaryButtonIsDisabled] =
    useState<boolean>(true);
  const a11yLabelId = useId();
  const { codeValue, handleCodeSubmit, showSyncDevicesHelp } = props;
  useEffect(() => {
    const isOTPInputComplete = COMPLETE_OTP_EXP.test(codeValue);
    if (isOTPInputComplete) {
      handleCodeSubmit(codeValue);
    }
    setPrimaryButtonIsDisabled(!isOTPInputComplete);
  }, [codeValue]);
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCodeSubmit(codeValue);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const filteredValue = e.target.value.replace(/\D/g, "");
    props.setCodeValue(filteredValue);
    props.resetErrorState();
  };
  return (
    <FormWrapper
      title={{
        text: props.titleCopy,
        labelId: codeLabelId,
      }}
      handleSubmit={handleFormSubmit}
      formActionsProps={{
        ...props.formActionsProps,
        primaryButtonIsDisabled,
      }}
    >
      <div className={styles.inputContainer}>
        <p className={styles.description} id={a11yLabelId}>
          {props.descriptionCopy}
        </p>

        <InputWithMessageWrapper
          type={MessageType.Error}
          message={props.error}
          theme={ThemeEnum.Dark}
        >
          <PinInput
            value={props.codeValue}
            maxLength={OTP_MAX_LENGTH}
            handleInputChange={handleInputChange}
            hasError={!!props.error}
            id={codeLabelId}
            labelId={codeLabelId}
            a11yLabelId={a11yLabelId}
            onFocus={props.onInputFocus}
          />
        </InputWithMessageWrapper>
        {props.formDetails ? props.formDetails : null}
      </div>
      {showSyncDevicesHelp ? (
        <InfoBox
          sx={{ marginTop: "16px" }}
          severity="subtle"
          size="small"
          title={translate(I18N_KEYS.SYNC_DEVICES_TIME_INFOBOX)}
        />
      ) : null}
    </FormWrapper>
  );
};
export default memo(OTPStep);
