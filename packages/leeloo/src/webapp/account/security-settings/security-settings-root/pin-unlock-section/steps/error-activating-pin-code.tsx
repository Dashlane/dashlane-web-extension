import classNames from "classnames";
import { Dialog, LinkButton, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../../webapp/variables";
import { HELP_CENTER_CONTACT_SUPPORT_URL } from "../../../../../../app/routes/constants";
interface ErrorPinCodeProps {
  onCancel: () => void;
  onTryAgain: () => void;
}
const I18N_KEYS = {
  CANCEL_DIALOG: "_common_action_cancel",
  TRY_AGAIN: "webapp_security_settings_activate_pin_code_flow_try_again",
  TITLE: "webapp_security_settings_activate_pin_code_flow_error_title",
  CONTENT: "webapp_security_settings_activate_pin_code_flow_error_content",
  CONTACT_SUPPORT:
    "webapp_security_settings_activate_pin_code_flow_error_contact_support",
};
export const ErrorActivatingPinCode = ({
  onCancel,
  onTryAgain,
}: ErrorPinCodeProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen
      dialogClassName={classNames(allIgnoreClickOutsideClassName)}
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={translate(I18N_KEYS.CANCEL_DIALOG)}
      onClose={onCancel}
      actions={{
        primary: {
          children: translate(I18N_KEYS.TRY_AGAIN),
          onClick: onTryAgain,
        },
        secondary: {
          children: (
            <LinkButton
              href={HELP_CENTER_CONTACT_SUPPORT_URL}
              onClick={onCancel}
              isExternal
            >
              {translate(I18N_KEYS.CONTACT_SUPPORT)}
            </LinkButton>
          ),
        },
      }}
    >
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.CONTENT)}
      </Paragraph>
    </Dialog>
  );
};
