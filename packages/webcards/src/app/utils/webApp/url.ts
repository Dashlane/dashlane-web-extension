import {
  AutofillEngineActions,
  AutofillEngineCommands,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/client";
const GET_PREMIUM_URL = "*****";
const BUY_B2B_PLAN = "*****";
export const getPremiumPricingUrl = (
  subscriptionCode: string,
  utmSource?: string
) => `${GET_PREMIUM_URL}?subCode=${subscriptionCode}&utm_source=${utmSource}`;
export const getBuyDashlaneB2BUrl = (
  subscriptionCode: string,
  utmSource?: string
) => `${BUY_B2B_PLAN}?subCode=${subscriptionCode}&utm_source=${utmSource}`;
export const redirectToGetPremiumPage = (
  autofillEngineCommands: AutofillEngineCommands,
  setAutofillEngineActionsHandlers: (
    handlers: Partial<AutofillEngineActions>
  ) => void
) => {
  setAutofillEngineActionsHandlers({
    updateUserSubscriptionCode: (subscriptionCode) => {
      autofillEngineCommands.openNewTabWithUrl(
        getPremiumPricingUrl(subscriptionCode)
      );
      setAutofillEngineActionsHandlers({
        updateUserSubscriptionCode: () => {},
      });
    },
  });
  autofillEngineCommands.getUserSubscriptionCode();
};
export const redirectToBuyDashlaneB2B = (
  autofillEngineCommands: AutofillEngineCommands,
  setAutofillEngineActionsHandlers: (
    handlers: Partial<AutofillEngineActions>
  ) => void
) => {
  setAutofillEngineActionsHandlers({
    updateUserSubscriptionCode: (subscriptionCode) => {
      autofillEngineCommands.openNewTabWithUrl(
        getBuyDashlaneB2BUrl(subscriptionCode)
      );
      setAutofillEngineActionsHandlers({
        updateUserSubscriptionCode: () => {},
      });
    },
  });
  autofillEngineCommands.getUserSubscriptionCode();
};
