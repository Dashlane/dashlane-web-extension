import {
  ChangeEvent,
  FormEvent,
  Fragment,
  memo,
  useCallback,
  useState,
} from "react";
import { Checkbox, Infobox, jsx } from "@dashlane/design-system";
import { UnlockProtectedItemsStatus } from "@dashlane/communication";
import Dialog from "../../components/dialog";
import MasterPasswordInput from "../../components/inputs/common/master-password-input/master-password-input";
import { ThemeEnum } from "../../libs/helpers-types";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  disableCredentialProtection,
  unlockProtectedItems,
  updateProtectPasswordsSetting,
} from "../../libs/api";
import dialogStyles from "../../components/dialog/styles.css";
export enum ConfirmLabelMode {
  Copy = "copy",
  CopyPassword = "copyPassword",
  Show = "show",
  ShowNote = "showNote",
  ShowPassword = "showPassword",
}
interface Props {
  confirmLabelMode: ConfirmLabelMode;
  onCancel: () => void;
  onSuccess: () => void;
  onError: () => void;
  showNeverAskOption?: boolean;
  credentialId?: string;
  requirePasswordGlobalSetting?: boolean;
}
const I18N_KEYS = {
  CANCEL: "master_password_dialog/cancel",
  COPY_PASSWORD: "master_password_dialog/confirm",
  COPY_GENERIC: "master_password_dialog/confirm_generic",
  SHOW_PASSWORD: "master_password_dialog/confirm_show",
  SHOW_NOTE: "master_password_dialog/confirm_show_note",
  SHOW_GENERIC: "master_password_dialog/confirm_show_generic",
  TITLE: "master_password_dialog/title",
  NEVER_ASK_CHECKBOX_CREDENTIAL_SETTING_ON:
    "master_password_dialog/never_ask_checkbox_credential_setting_on",
  NEVER_ASK_CHECKBOX_GLOBAL_SETTING_ON:
    "master_password_dialog/never_ask_checkbox_global_setting_on",
  NEVER_ASK_CHECKBOX_GLOBAL_SETTING_ON_WARNING:
    "master_password_dialog/never_ask_checkbox_global_setting_on_warning",
};
const MasterPasswordDialog = ({
  confirmLabelMode,
  onCancel,
  onSuccess,
  onError,
  showNeverAskOption = false,
  credentialId,
  requirePasswordGlobalSetting = false,
}: Props) => {
  const { translate } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [neverAskCheckbox, setNeverAskCheckbox] = useState(false);
  const resetPassword = useCallback(() => setPassword(""), []);
  const handleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);
  const [error, setError] = useState("");
  const setNoErrorState = useCallback(() => setError(""), []);
  const handlePasswordInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNoErrorState();
      setPassword(e.target.value);
    },
    [setNoErrorState]
  );
  const handleCheckboxChange = useCallback(() => {
    setNeverAskCheckbox(!neverAskCheckbox);
  }, [neverAskCheckbox]);
  const confirmDialog = useCallback(
    async (e: FormEvent<HTMLElement>) => {
      e.preventDefault();
      const commandResult = await unlockProtectedItems(password);
      switch (commandResult.status) {
        case UnlockProtectedItemsStatus.SUCCESS:
          if (neverAskCheckbox) {
            if (requirePasswordGlobalSetting) {
              await updateProtectPasswordsSetting(
                !requirePasswordGlobalSetting
              );
            } else if (credentialId) {
              await disableCredentialProtection(credentialId);
            }
          }
          onSuccess();
          break;
        case UnlockProtectedItemsStatus.ERROR:
        default:
          setError("WRONG_PASSWORD");
          onError();
          break;
      }
    },
    [
      credentialId,
      neverAskCheckbox,
      onError,
      onSuccess,
      password,
      requirePasswordGlobalSetting,
    ]
  );
  const cancelDialog = useCallback(() => {
    onCancel();
    resetPassword();
    setNoErrorState();
  }, [onCancel, resetPassword, setNoErrorState]);
  const isPasswordEmpty = password === "";
  const getConfirmLabel = useCallback(() => {
    switch (confirmLabelMode) {
      case ConfirmLabelMode.Copy:
        return translate(I18N_KEYS.COPY_GENERIC);
      case ConfirmLabelMode.CopyPassword:
        return translate(I18N_KEYS.COPY_PASSWORD);
      case ConfirmLabelMode.ShowPassword:
        return translate(I18N_KEYS.SHOW_PASSWORD);
      case ConfirmLabelMode.ShowNote:
        return translate(I18N_KEYS.SHOW_NOTE);
      case ConfirmLabelMode.Show:
        return translate(I18N_KEYS.SHOW_GENERIC);
      default:
        return "";
    }
  }, [confirmLabelMode, translate]);
  return (
    <Dialog
      visible={true}
      onConfirm={(event: FormEvent<HTMLElement>) => {
        void confirmDialog(event);
      }}
      onCancel={cancelDialog}
      confirmLabel={getConfirmLabel()}
      cancelLabel={translate(I18N_KEYS.CANCEL)}
      isConfirmDisabled={isPasswordEmpty}
    >
      <h2 className={dialogStyles.title}>{translate(I18N_KEYS.TITLE)}</h2>
      <form
        onSubmit={(event: FormEvent<HTMLElement>) => {
          void confirmDialog(event);
        }}
        noValidate
      >
        <div className={dialogStyles.inputWrapper}>
          <MasterPasswordInput
            error={error}
            password={password}
            showPassword={showPassword}
            handlePasswordInputChange={handlePasswordInputChange}
            handleShowPassword={handleShowPassword}
            theme={ThemeEnum.Light}
          />
          {showNeverAskOption ? (
            <>
              <Checkbox
                data-testid="neverAskCheckbox"
                checked={neverAskCheckbox}
                onChange={handleCheckboxChange}
                sx={{ margin: "12px 0px" }}
                label={
                  requirePasswordGlobalSetting
                    ? translate(I18N_KEYS.NEVER_ASK_CHECKBOX_GLOBAL_SETTING_ON)
                    : translate(
                        I18N_KEYS.NEVER_ASK_CHECKBOX_CREDENTIAL_SETTING_ON
                      )
                }
              />
              {requirePasswordGlobalSetting && (
                <Infobox
                  mood="danger"
                  size="small"
                  title={translate(
                    I18N_KEYS.NEVER_ASK_CHECKBOX_GLOBAL_SETTING_ON_WARNING
                  )}
                />
              )}
            </>
          ) : null}
        </div>
      </form>
    </Dialog>
  );
};
export default memo(MasterPasswordDialog);
