import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useSubscriptionInformation } from "../../libs/carbon/hooks/useSubscriptionInformation";
export const useBillingCountry = () => {
  const subscriptionInformation = useSubscriptionInformation();
  const loading =
    subscriptionInformation.status !== DataStatus.Success ||
    !subscriptionInformation.data;
  const billingInformation =
    subscriptionInformation?.status === DataStatus.Success
      ? subscriptionInformation?.data?.b2bSubscription?.billingInformation
      : null;
  const billingCountry = billingInformation?.country;
  return {
    loading,
    billingCountry,
  };
};
