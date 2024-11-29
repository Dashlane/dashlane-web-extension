import { differenceInCalendarDays, fromUnixTime } from "date-fns";
import { CallToAction, UserCallToActionEvent } from "@dashlane/hermes";
import { logEvent } from "../logs/logEvent";
export const getDaysLeftInTrial = (dateUnix: number) =>
  differenceInCalendarDays(fromUnixTime(dateUnix), new Date());
export const getDaysExpiredAfterTrial = (dateUnix: number) =>
  Math.abs(getDaysLeftInTrial(dateUnix));
export const logCallToActionEvent = (chosenAction: CallToAction) => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [
        CallToAction.PayWithCreditCard,
        CallToAction.PayByInvoice,
        CallToAction.Dismiss,
      ],
      chosenAction,
      hasChosenNoAction: false,
    })
  );
};
