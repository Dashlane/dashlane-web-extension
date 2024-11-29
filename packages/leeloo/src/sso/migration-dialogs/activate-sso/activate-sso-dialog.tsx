import React from "react";
import {
  CloudKeyIcon,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
  OpenWebsiteIcon,
} from "@dashlane/ui-components";
import { openUrl, redirectToUrl } from "../../../libs/external-urls";
import { redirect } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DASHLANE_BUSINESS_PLAN_SSO_LOGGING_IN } from "../../../team/urls";
import styles from "./activate-sso-dialog.css";
const I18N_KEYS = {
  ACTIVATE_SSO_TITLE: "activate_sso_popup_title",
  ACTIVATE_SSO_BODY: "activate_sso_popup_body",
  ACTIVATE_SSO_BODY_SECOND: "activate_sso_popup_body_secondary",
  ACTIVATE_SSO_PRIMARY_BUTTON: "activate_sso_popup_primary_button",
  ACTIVATE_SSO_SECONDARY_BUTTON: "activate_sso_popup_secondary_button",
  CLOSE: "_common_dialog_dismiss_button",
};
interface ActivateSSOProps {
  activateLink: string;
  onClose: () => void;
  localSsoRedirect: boolean;
  isNitroSSO: boolean;
  nitroLoginCommand: () => void;
}
export const ActivateSSODialog = ({
  activateLink,
  onClose,
  localSsoRedirect,
  isNitroSSO,
  nitroLoginCommand,
}: ActivateSSOProps) => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = React.useState(true);
  const handleOpenUrl = async () => {
    if (localSsoRedirect) {
      return redirect(activateLink);
    }
    if (isNitroSSO) {
      nitroLoginCommand();
    } else {
      redirectToUrl(activateLink);
    }
  };
  const handleOnClose = () => {
    setIsOpen(false);
    onClose();
  };
  return (
    <Dialog
      closeIconName={translate(I18N_KEYS.CLOSE)}
      isOpen={isOpen}
      onClose={handleOnClose}
      disableOutsideClickClose
    >
      <div className={styles.dialogContainer}>
        <DialogTitle>
          <CloudKeyIcon size={90} />
          <h2 className={styles.activateSSOTitle}>
            {translate(I18N_KEYS.ACTIVATE_SSO_TITLE)}
          </h2>
        </DialogTitle>
        <DialogBody>
          <p className={styles.activateSSOText}>
            {translate(I18N_KEYS.ACTIVATE_SSO_BODY)}
          </p>
          <p className={styles.activateSSOText}>
            {translate(I18N_KEYS.ACTIVATE_SSO_BODY_SECOND)}
          </p>
        </DialogBody>
        <DialogFooter
          primaryButtonOnClick={handleOpenUrl}
          primaryButtonTitle={translate(I18N_KEYS.ACTIVATE_SSO_PRIMARY_BUTTON)}
          secondaryButtonOnClick={() =>
            openUrl(DASHLANE_BUSINESS_PLAN_SSO_LOGGING_IN)
          }
          secondaryButtonTitle={
            <>
              <OpenWebsiteIcon size={20} />
              <p className={styles.activateSSOTextWithIcon}>
                {translate(I18N_KEYS.ACTIVATE_SSO_SECONDARY_BUTTON)}
              </p>
            </>
          }
        />
      </div>
    </Dialog>
  );
};
