import * as React from "react";
import { colors, Link } from "@dashlane/ui-components";
import FormWrapper from "../FormWrapper";
import InputWithMessageWrapper, {
  MessageType,
} from "../../../components/inputs/login/InputWithMessageWrapper";
import { FormActionsProps } from "../FormWrapper/FormActions";
import { ThemeEnum } from "../../../libs/helpers-types";
import FormInput from "../../../components/inputs/login/FormInput";
import styles from "./styles.css";
const BACKUP_CODE_LENGTH = 16;
const CODE_LABEL_ID = "code";
export interface BackupCodeStepProps {
  titleCopy: string;
  descriptionCopy: string;
  lostCodeCopy: string;
  lostCodeLinkCopy: string;
  lostCodeLink: string;
  handleCodeSubmit: (code: string) => void;
  resetErrorState: () => void;
  error?: string;
  onInputFocus?: () => void;
  formActionsProps: FormActionsProps;
  codeValue: string;
  setCodeValue: (code: string) => void;
}
const BackupCodeStep = (props: BackupCodeStepProps) => {
  const [primaryButtonIsDisabled, setPrimaryButtonIsDisabled] =
    React.useState<boolean>(true);
  const { codeValue, handleCodeSubmit } = props;
  React.useEffect(() => {
    const isBackupCodeInputComplete = codeValue.length >= BACKUP_CODE_LENGTH;
    setPrimaryButtonIsDisabled(!isBackupCodeInputComplete);
  }, [codeValue, handleCodeSubmit]);
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCodeSubmit(codeValue);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.setCodeValue(e.target.value);
    props.resetErrorState();
  };
  return (
    <FormWrapper
      title={{
        text: props.titleCopy,
        labelId: CODE_LABEL_ID,
      }}
      handleSubmit={handleFormSubmit}
      formActionsProps={{
        ...props.formActionsProps,
        primaryButtonIsDisabled,
      }}
    >
      <div className={styles.inputContainer}>
        <p className={styles.description}>{props.descriptionCopy}</p>
        <InputWithMessageWrapper
          type={MessageType.Error}
          message={props.error}
          theme={ThemeEnum.Dark}
        >
          <FormInput
            value={props.codeValue}
            hasError={!!props.error}
            placeholder=""
            inputType="text"
            handleChange={handleInputChange}
            ariaLabelledBy={CODE_LABEL_ID}
            theme={ThemeEnum.Dark}
          />
        </InputWithMessageWrapper>
        <p className={styles.description} style={{ marginTop: "24px" }}>
          {`${props.lostCodeCopy} `}
          <Link
            href={props.lostCodeLink}
            color={colors.dashGreen04}
            hoverColor={colors.midGreen02}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.lostCodeLinkCopy}
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};
export default React.memo(BackupCodeStep);
