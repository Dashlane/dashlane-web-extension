import { SpaceTier } from "@dashlane/communication";
import { AlertSeverity } from "@dashlane/ui-components";
import { getLocalizedPlanTier } from "../../../libs/account/helpers";
import { Lee } from "../../../lee";
import { showNotification } from "./notification";
import { TranslatorInterface } from "../../../libs/i18n/types";
const I18N_KEYS = {
  FREE_TRIAL_D0_TO_15: "team_notifications_free_trial_D0_T15_markup",
};
interface BaseFreeTrialNotificationArguments {
  lee: Lee;
  spaceTier: SpaceTier;
  translate: TranslatorInterface;
}
type ShowFreeTrialD0To15NotificationArguments =
  BaseFreeTrialNotificationArguments;
export const showFreeTrialD0To15Notification = ({
  lee,
  spaceTier,
  translate,
}: ShowFreeTrialD0To15NotificationArguments) => {
  const localizedPlanTier = getLocalizedPlanTier({
    tier: spaceTier,
    translate,
  });
  showNotification({
    lee,
    notificationKey: I18N_KEYS.FREE_TRIAL_D0_TO_15,
    keyParams: { planTier: localizedPlanTier },
    level: AlertSeverity.SUCCESS,
    redirectPath: lee.routes.teamAccountRoutePath,
  });
};
