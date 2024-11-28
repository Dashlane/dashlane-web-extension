import * as React from "react";
import { Action } from "redux";
import { UserMessageTypes } from "@dashlane/communication";
import { Button, InfoBox } from "@dashlane/ui-components";
import { carbonConnector } from "../../../../carbonConnector";
import { getSubscriptionUrl } from "../helpers";
import { openExternalUrl } from "../../../../libs/externalUrls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  CONTENT: "embed_alert_extend_premium_content",
  CTA_LABEL: "embed_alert_extend_premium_cta",
  DISMISS_LABEL: "embed_alert_extend_premium_dismiss",
  TITLE: "embed_alert_extend_premium_title",
};
interface PremiumAlertProps {
  onClick: () => void;
  onDismiss: () => void;
  dispatch: (action: Action) => void;
  subscriptionCode: string | null;
}
const PremiumAlertComponent: React.FC<PremiumAlertProps> = ({
  onClick,
  onDismiss,
  dispatch,
  subscriptionCode,
}) => {
  const { translate } = useTranslate();
  const dismiss = React.useCallback(() => {
    onDismiss();
    carbonConnector.dismissUserMessages({
      type: UserMessageTypes.TRIAL_EXPIRED,
    });
  }, [dispatch, onDismiss]);
  const handleClick = React.useCallback(() => {
    openExternalUrl(getSubscriptionUrl(subscriptionCode));
    onClick();
    dismiss();
  }, [onClick, dismiss, subscriptionCode]);
  return (
    <InfoBox
      className={styles.alert}
      severity="strong"
      size="descriptive"
      title={translate(I18N_KEYS.TITLE)}
      actions={[
        <Button
          type="button"
          nature="secondary"
          key="secondary"
          onClick={dismiss}
        >
          {translate(I18N_KEYS.DISMISS_LABEL)}
        </Button>,
        <Button
          type="button"
          nature="primary"
          key="primary"
          onClick={handleClick}
        >
          {translate(I18N_KEYS.CTA_LABEL)}
        </Button>,
      ]}
    >
      <p>{translate(I18N_KEYS.CONTENT)}</p>
    </InfoBox>
  );
};
export const PremiumAlert = React.memo(PremiumAlertComponent);
