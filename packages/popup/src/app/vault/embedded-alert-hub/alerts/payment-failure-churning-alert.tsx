import * as React from "react";
import { Button, InfoBox } from "@dashlane/ui-components";
import { NotificationName } from "@dashlane/communication";
import { DataStatus } from "../../../../libs/api/types";
import {
  dismissNotification,
  usePremiumStatusData,
} from "../../../../libs/api";
import { getSubscriptionUrl } from "../helpers";
import { openExternalUrl } from "../../../../libs/externalUrls";
import { translationService } from "../../../../libs/i18n";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { carbonConnector } from "../../../../carbonConnector";
import styles from "./styles.css";
const I18N_KEYS = {
  CONTENT: "embed_alert_payment_failure_churning_content",
  CTA_LABEL: "embed_alert_payment_failure_churning_cta",
  DISMISS_LABEL: "embed_alert_payment_failure_churning_dismiss",
  TITLE: "embed_alert_payment_failure_churning_title",
};
interface PaymentFailureChurningAlertProps {
  onClick: () => void;
  onDismiss: () => void;
}
export const formatDate = (date: number) => {
  const d = new Date(0);
  d.setUTCSeconds(date);
  return d.toLocaleString(translationService.getLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const PaymentFailureChurningComponent: React.FC<
  PaymentFailureChurningAlertProps
> = ({ onClick, onDismiss }) => {
  const { translate } = useTranslate();
  const dismiss = React.useCallback(() => {
    void carbonConnector.updatePremiumChurningDismissDate();
    dismissNotification(NotificationName.PaymentFailureChurning);
    onDismiss();
  }, [onDismiss]);
  const handleClick = React.useCallback(() => {
    openExternalUrl(getSubscriptionUrl());
    onClick();
  }, [onClick]);
  const premiumStatusQuery = usePremiumStatusData();
  if (premiumStatusQuery.status === DataStatus.Success) {
    const date = premiumStatusQuery.data?.endDate;
    if (date === undefined) {
      return null;
    }
    const premiumEndDate = formatDate(date);
    return (
      <InfoBox
        size="descriptive"
        severity="alert"
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
        <p>{translate(I18N_KEYS.CONTENT, { premiumEndDate })}</p>
      </InfoBox>
    );
  }
  return null;
};
export const PaymentFailureChurningAlert = React.memo(
  PaymentFailureChurningComponent
);
