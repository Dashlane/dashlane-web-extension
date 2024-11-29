import { useState } from "react";
import { Paragraph, TextArea } from "@dashlane/design-system";
import { DialogFooter } from "@dashlane/ui-components";
import { CheckDirectorySyncKeyRequest } from "@dashlane/communication";
import { checkDirectorySyncKeyResponse } from "../../../libs/carbon/triggers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { StepDialogWithTitle } from "./step-dialog-with-title";
const I18N_KEYS = {
  VERIFY: "team_directory_sync_key_dialog_key_input_verify",
  POSTPONE: "team_directory_sync_key_dialog_key_input_postpone",
  MESSAGE_MARKUP: "team_directory_sync_key_dialog_key_input_message_markup",
  PLACEHOLDER: "team_directory_sync_key_dialog_key_input_placeholder",
  INVALID: "team_directory_sync_key_dialog_key_input_invalid",
};
interface Props {
  onSubmitKeySuccess: () => void;
  onSubmitKeyError: () => void;
  checkDirectorySyncKeyRequest: () => CheckDirectorySyncKeyRequest | null;
  handleDismiss: () => void;
  handleError: () => void;
}
interface InputKeyState {
  inputKey: string;
  isInputKeyInvalid: boolean;
}
export const KeyInputStep = ({
  onSubmitKeySuccess,
  onSubmitKeyError,
  checkDirectorySyncKeyRequest,
  handleDismiss,
  handleError,
}: Props) => {
  const { translate } = useTranslate();
  const [inputKeyState, setInputKeyState] = useState<InputKeyState>({
    inputKey: "",
    isInputKeyInvalid: false,
  });
  const validateKey = () => {
    const params = checkDirectorySyncKeyRequest();
    if (!params) {
      return Promise.reject(new Error("missing params"));
    }
    return checkDirectorySyncKeyResponse(params, "validated");
  };
  const isKeyValid = (key: string): boolean => {
    if (key.length % 4 !== 0) {
      return false;
    }
    const decoded = atob(key);
    return decoded.includes("</RSAKeyValue>");
  };
  const setInvalidKey = () => {
    setInputKeyState((prevState) => ({
      ...prevState,
      isInputKeyInvalid: true,
    }));
  };
  const handleSubmitKey = async () => {
    const { publicKey = "" } = checkDirectorySyncKeyRequest() ?? {};
    const cleanKey = inputKeyState.inputKey
      .replace(/\s/g, "")
      .replace(/\n/g, "");
    if (cleanKey === publicKey) {
      validateKey()
        .then(() => {
          onSubmitKeySuccess();
        })
        .catch(handleError);
    } else if (!isKeyValid(cleanKey)) {
      setInvalidKey();
    } else {
      onSubmitKeyError();
    }
  };
  const handleKeyInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target: { value: inputKey },
  }) => {
    setInputKeyState({
      inputKey,
      isInputKeyInvalid: false,
    });
  };
  return (
    <StepDialogWithTitle
      onRequestClose={handleDismiss}
      footer={
        <DialogFooter
          primaryButtonTitle={translate(I18N_KEYS.VERIFY)}
          primaryButtonOnClick={handleSubmitKey}
          secondaryButtonTitle={translate(I18N_KEYS.POSTPONE)}
          secondaryButtonOnClick={handleDismiss}
          intent="primary"
        />
      }
    >
      <Paragraph sx={{ marginBottom: "2em" }} color="ds.text.neutral.quiet">
        {translate.markup(I18N_KEYS.MESSAGE_MARKUP)}
      </Paragraph>
      <TextArea
        placeholder={translate(I18N_KEYS.PLACEHOLDER)}
        onChange={handleKeyInputChange}
        value={inputKeyState.inputKey}
        feedback={
          inputKeyState.isInputKeyInvalid
            ? { text: translate(I18N_KEYS.INVALID) }
            : undefined
        }
        error={inputKeyState.isInputKeyInvalid}
      />
    </StepDialogWithTitle>
  );
};
