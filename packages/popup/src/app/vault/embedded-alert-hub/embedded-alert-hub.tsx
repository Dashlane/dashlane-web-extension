import { useEffect, useState } from "react";
import { Action } from "redux";
import { WebOnboardingModeEvent } from "@dashlane/communication";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { jsx } from "@dashlane/design-system";
import { Alert, AlertName, getAlert } from "./helpers";
import { kernel } from "../../../kernel";
import { carbonConnector } from "../../../carbonConnector";
import {
  BrazeContentCardInfoBox,
  MasterPasswordLeakAlert,
  MasterPasswordWeakAlert,
  OnboardingAlert,
  PaymentFailureChurnedAlert,
  PaymentFailureChurningAlert,
  PremiumAlert,
} from "./alerts";
import { PasswordLimitReachedAlert } from "./alerts/password-limit-reached-alert";
import { PasswordLimitAlmostReachedAlert } from "./alerts/password-limit-almost-reached-alert";
import {
  useDismissMasterPasswordNotification,
  useIsBrazeContentDisabled,
  useIsMasterPasswordLeaked,
  useIsMasterPasswordWeak,
  usePaymentFailureNotificationData,
  usePremiumStatus,
  useSubscriptionCode,
  useUserMessages,
} from "../../../libs/api";
import { useShowPasswordLimit } from "../../../libs/hooks/use-show-password-limit";
import { useIsUserFrozen } from "../../../libs/hooks/use-is-user-frozen";
import { useFooterAlertHubContext } from "../../footer/footer-alert-hub/footer-alert-hub-context";
export interface EmbeddedAlertHubProps {
  dispatch: (action: Action) => void;
  webOnboardingMode: WebOnboardingModeEvent | null;
}
export interface EmbeddedAlertComponentProps {
  dispatch: (action: Action) => void;
  alertName: AlertName | null;
}
const EmbeddedAlertComponent = ({
  dispatch,
  alertName,
}: EmbeddedAlertComponentProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissMasterPasswordNotification =
    useDismissMasterPasswordNotification();
  const isBrazeContentDisabledResponse = useIsBrazeContentDisabled();
  const isBrazeContentDisabled =
    isBrazeContentDisabledResponse.status === DataStatus.Success &&
    Boolean(isBrazeContentDisabledResponse.data);
  const subscriptionCode = useSubscriptionCode();
  const onDismiss = (alert: AlertName) => {
    switch (alert) {
      case AlertName.Onboarding:
        {
          const newWebOnboardingMode: WebOnboardingModeEvent = {
            popoverStep: null,
          };
          void carbonConnector.updateWebOnboardingMode(newWebOnboardingMode);
        }
        break;
      case AlertName.MasterPasswordLeak:
      case AlertName.MasterPasswordWeak:
        dismissMasterPasswordNotification();
        break;
    }
    setIsDismissed(true);
  };
  const onClick = () => {
    setIsDismissed(true);
    kernel.browser.closePopover();
  };
  if (isDismissed) {
    return null;
  }
  switch (alertName) {
    case AlertName.Onboarding:
      return (
        <OnboardingAlert onDismiss={() => onDismiss(AlertName.Onboarding)} />
      );
    case AlertName.MasterPasswordLeak:
      return (
        <MasterPasswordLeakAlert
          onDismiss={() => onDismiss(AlertName.MasterPasswordLeak)}
        />
      );
    case AlertName.MasterPasswordWeak:
      return (
        <MasterPasswordWeakAlert
          onDismiss={() => onDismiss(AlertName.MasterPasswordWeak)}
        />
      );
    case AlertName.PaymentFailureChurning:
      return (
        <PaymentFailureChurningAlert
          onClick={onClick}
          onDismiss={() => onDismiss(AlertName.PaymentFailureChurning)}
        />
      );
    case AlertName.PaymentFailureChurned:
      return (
        <PaymentFailureChurnedAlert
          onClick={onClick}
          onDismiss={() => onDismiss(AlertName.PaymentFailureChurned)}
        />
      );
    case AlertName.Premium:
      return (
        <PremiumAlert
          onClick={onClick}
          onDismiss={() => onDismiss(AlertName.Premium)}
          dispatch={dispatch}
          subscriptionCode={subscriptionCode}
        />
      );
    case AlertName.PasswordLimit:
      return <PasswordLimitReachedAlert />;
    case AlertName.PasswordLimitAlmostReached:
      return <PasswordLimitAlmostReachedAlert />;
    case AlertName.None:
    default:
      return isBrazeContentDisabled ? null : <BrazeContentCardInfoBox />;
  }
};
const EmbeddedAlertHub = ({
  dispatch,
  webOnboardingMode,
}: EmbeddedAlertHubProps) => {
  const messages = useUserMessages();
  const paymentFailureNotification = usePaymentFailureNotificationData();
  const shouldDisplayMasterPasswordLeak = useIsMasterPasswordLeaked();
  const shouldDisplayMasterPasswordWeak = useIsMasterPasswordWeak();
  const passwordLimit = useShowPasswordLimit();
  const premiumStatus = usePremiumStatus();
  const isUserFrozen = useIsUserFrozen();
  const { setIsEmbeddedAlertShown } = useFooterAlertHubContext();
  const alert: Alert =
    passwordLimit === null || premiumStatus === null || isUserFrozen.isLoading
      ? null
      : getAlert({
          messages,
          paymentFailureNotification,
          shouldDisplayMasterPasswordLeak,
          shouldDisplayMasterPasswordWeak,
          passwordLimit,
          isUserFrozen: isUserFrozen.isUserFrozen,
          webOnboardingMode,
          premiumStatus,
        });
  useEffect(() => {
    if (alert && alert !== AlertName.None) {
      setIsEmbeddedAlertShown();
    }
  }, [alert, setIsEmbeddedAlertShown]);
  return alert ? (
    <EmbeddedAlertComponent alertName={alert} dispatch={dispatch} />
  ) : null;
};
export const EmbeddedAlertWrapper = (props: EmbeddedAlertHubProps) => {
  return <EmbeddedAlertHub {...props} />;
};
