import type {
  ChangeEventHandler,
  KeyboardEvent,
  PropsWithChildren,
} from "react";
import { Dialog, PasswordField } from "@dashlane/design-system";
import useTranslate from "../../../i18n/useTranslate";
interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
  isMasterPasswordInvalid: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onDismiss: () => void;
  onConfirm?: () => void;
  labelDismiss?: string;
  labelConfirm?: string;
  title?: string;
  ctaIsDisabled?: boolean;
  isOpen: boolean;
}
const I18N = {
  CONFIRMATION_ERROR: "team_settings_confirmation_dialog_error_message",
  PASSWORD_SHOW: "team_settings_confirmation_dialog_password_field_show_label",
  PASSWORD_HIDE: "team_settings_confirmation_dialog_password_field_hide_label",
  MP_INPUT_LABEL: "webapp_lock_items_security_settings_title",
  CLOSE: "_common_dialog_dismiss_button",
};
const ConfirmationDialog = ({
  onChange,
  defaultValue,
  isMasterPasswordInvalid,
  onKeyDown,
  onDismiss,
  onConfirm,
  labelDismiss,
  labelConfirm,
  title,
  ctaIsDisabled,
  isOpen,
  children,
}: PropsWithChildren<Props>) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      closeActionLabel={translate(I18N.CLOSE)}
      isOpen={isOpen}
      onClose={onDismiss}
      title={title}
      actions={{
        primary: {
          children: labelConfirm,
          onClick: onConfirm,
          disabled: ctaIsDisabled,
        },
        secondary: {
          children: labelDismiss,
          onClick: onDismiss,
        },
      }}
    >
      <div sx={{ marginBottom: "30px" }}>{children}</div>
      <PasswordField
        label={translate(I18N.MP_INPUT_LABEL)}
        value={defaultValue}
        feedback={{
          text: isMasterPasswordInvalid
            ? translate(I18N.CONFIRMATION_ERROR)
            : "",
        }}
        error={isMasterPasswordInvalid}
        onChange={onChange}
        onKeyDown={onKeyDown}
        toggleVisibilityLabel={{
          hide: translate(I18N.PASSWORD_HIDE),
          show: translate(I18N.PASSWORD_SHOW),
        }}
      />
    </Dialog>
  );
};
export default ConfirmationDialog;
