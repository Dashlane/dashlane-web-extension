import {
  CarbonEndpointResult,
  DataStatus,
} from "@dashlane/carbon-api-consumers";
import { PremiumStatus } from "@dashlane/communication";
import {
  FlowStep,
  Button as HermesButton,
  UserAddNewPaymentMethodEvent,
  UserClickEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
import { logUserUpdatePaymentMethodEvent } from "../../../webapp/subscription-management/logs";
import { useCreditCardPaymentMethodDisplay } from "../../account/upgrade-success/useCreditCardPaymentDisplay";
interface UsePaymentMethodActionsProps {
  setPaymentLoading: (loading: boolean) => void;
  premiumStatus: CarbonEndpointResult<PremiumStatus>;
  isB2C?: boolean;
}
export const usePaymentMethodActions = ({
  setPaymentLoading,
  premiumStatus,
  isB2C = false,
}: UsePaymentMethodActionsProps) => {
  const handleCardUpdate = (updateSuccessful: boolean) => {
    if (updateSuccessful && premiumStatus.status === DataStatus.Success) {
      logUserUpdatePaymentMethodEvent(premiumStatus.data, FlowStep.Complete);
    }
  };
  const { pollUntilCardUpdate } = useCreditCardPaymentMethodDisplay({
    b2c: isB2C,
    handleCardUpdate,
  });
  const handleClickAddBillingInfo = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
    logEvent(
      new UserClickEvent({
        button: HermesButton.AddPaymentInfo,
      })
    );
    logEvent(
      new UserAddNewPaymentMethodEvent({
        flowStep: FlowStep.Start,
      })
    );
  };
  const handleClickEditBillingInfo = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpdatePaymentMethod,
      })
    );
    if (premiumStatus.status === DataStatus.Success) {
      logUserUpdatePaymentMethodEvent(premiumStatus.data, FlowStep.Start);
    }
  };
  return {
    handleClickAddBillingInfo,
    handleClickEditBillingInfo,
  };
};
