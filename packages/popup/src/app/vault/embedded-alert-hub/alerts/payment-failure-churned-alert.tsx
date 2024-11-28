import * as React from "react";
import { Button, InfoBox } from "@dashlane/ui-components";
import { NotificationName } from "@dashlane/communication";
import { dismissNotification } from "../../../../libs/api";
import { getSubscriptionUrl } from "../helpers";
import { openExternalUrl } from "../../../../libs/externalUrls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  CONTENT: "embed_alert_payment_failure_churned_content",
  CTA_LABEL: "embed_alert_payment_failure_churned_cta",
  DISMISS_LABEL: "embed_alert_payment_failure_churned_dismiss",
  TITLE: "embed_alert_payment_failure_churned_title",
};
interface PaymentFailureChurnedAlertProps {
  onClick: () => void;
  onDismiss: () => void;
}
export const PaymentFailureChurnedComponent: React.FC<
  PaymentFailureChurnedAlertProps
> = ({ onClick, onDismiss }) => {
  const { translate } = useTranslate();
  const dismiss = React.useCallback(() => {
    dismissNotification(NotificationName.PaymentFailureChurned);
    onDismiss();
  }, [onDismiss]);
  const handleClick = React.useCallback(() => {
    openExternalUrl(getSubscriptionUrl());
    onClick();
  }, [onClick]);
  return (
    <InfoBox
      size="descriptive"
      title={translate(I18N_KEYS.TITLE)}
      className={styles.alert}
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
export const PaymentFailureChurnedAlert = React.memo(
  PaymentFailureChurnedComponent
);
