import { useEffect } from "react";
import { Dialog, LinkButton, Paragraph } from "@dashlane/design-system";
import {
  Button,
  ClickOrigin,
  PageView,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  passwordLimitApi,
  vaultNotificationsApi,
} from "@dashlane/vault-contracts";
import {
  GET_CURRENT_FREE_PLAN_URL,
  GET_PREMIUM_FAMILY_URL,
  GET_PREMIUM_URL,
} from "../../../app/routes/constants";
import { openDashlaneUrl } from "../../external-urls";
import { useIsFreeB2CUser } from "../../carbon/hooks/useNodePremiumStatus";
import useTranslate from "../../i18n/useTranslate";
import { logEvent, logPageView } from "../../logs/logEvent";
import { useRouterGlobalSettingsContext } from "../../router";
import { PlanContainer } from "./plan-container";
import {
  getFamilyFeatureList,
  getFreeFeatureList,
  getPremiumFeatureList,
} from "./feature-list";
import { getPeriodicityLabelOfPlan } from "./helpers";
import { b2cPlansApi } from "@dashlane/plans-contracts";
interface Props {
  onClose: () => void;
}
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  TITLE_FROZEN_ACCOUNT: "webapp_frozen_state_title_dialog_frozen_account",
  TITLE_FREE_TRIAL_ENDED_FROZEN_ACCOUNT:
    "webapp_frozen_state_title_dialog_trial_ended_frozen_account",
  TITLE_FREE_TRIAL_ENDED: "webapp_frozen_state_title_dialog_trial_ended",
  DESCRIPTION_FROZEN: "webapp_frozen_state_description_dialog_frozen_account",
  DESCRIPTION_LIMITED: "webapp_frozen_state_description_dialog_frozen_limited",
  FREE_PLAN_TITLE: "webapp_frozen_state_free_plan_title",
  PREMIUM_PLAN_TITLE: "webapp_frozen_state_premium_plan_title",
  FAMILY_FRIENDS_PLAN_TITLE: "webapp_frozen_state_family_friends_plan_title",
  KEEP_FREE_BUTTON: "webapp_frozen_state_keep_free_button",
  UPGRADE_BUTTON: "webapp_frozen_state_upgrade_button",
  MANAGE_LOGINS_BUTTON: "webapp_frozen_state_manage_logins_button",
  FREE_PLAN_FEATURES_TITLE: "webapp_frozen_state_free_features_title",
  PREMIUM_FEATURES_TITLE: "webapp_frozen_state_premium_features_title",
  FAMILY_FRIENDS_FEATURES_TITLE:
    "webapp_frozen_state_family_friends_features_title",
  COMPARE_PLANS_BUTTON: "webapp_frozen_state_compare_plans_button",
  INFOBOX_TITLE_FROZEN: "webapp_frozen_infobox_title_frozen",
  INFOBOX_TITLE_LIMITED: "webapp_frozen_infobox_title_limited",
  INFOBOX_DESCRIPTION_FROZEN: "webapp_frozen_infobox_description_frozen",
  INFOBOX_DESCRIPTION_LIMITED: "webapp_frozen_infobox_description_limited",
};
export const B2CFrozenStateDialog = ({ onClose }: Props) => {
  const { translate } = useTranslate();
  const useIsUserInAfterTrialPeriod = useIsFreeB2CUser();
  const { routes } = useRouterGlobalSettingsContext();
  const isUserFrozen = useModuleQuery(passwordLimitApi, "isFreeUserFrozen");
  const plansData = useModuleQuery(b2cPlansApi, "getB2CPlanPricing");
  const { setVaultNotificationsStatus } = useModuleCommands(
    vaultNotificationsApi
  );
  const shouldNotRenderDialog =
    !isUserFrozen.data && !useIsUserInAfterTrialPeriod.isFreeB2CInPostTrial;
  useEffect(() => {
    if (!shouldNotRenderDialog) {
      logPageView(PageView.AccountFrozenModal);
    }
  }, [shouldNotRenderDialog]);
  if (
    isUserFrozen.status !== DataStatus.Success ||
    plansData.status !== DataStatus.Success ||
    useIsUserInAfterTrialPeriod.isLoading
  ) {
    return null;
  }
  if (shouldNotRenderDialog) {
    return null;
  }
  const { plans, currency } = plansData.data;
  const { family, premium } = plans;
  const getTitle = (): string | undefined => {
    if (
      isUserFrozen.data &&
      !useIsUserInAfterTrialPeriod.isFreeB2CInPostTrial
    ) {
      return translate(I18N_KEYS.TITLE_FROZEN_ACCOUNT);
    } else if (
      isUserFrozen.data &&
      useIsUserInAfterTrialPeriod.isFreeB2CInPostTrial
    ) {
      return translate(I18N_KEYS.TITLE_FREE_TRIAL_ENDED_FROZEN_ACCOUNT);
    } else if (
      !isUserFrozen.data &&
      useIsUserInAfterTrialPeriod.isFreeB2CInPostTrial
    ) {
      return translate(I18N_KEYS.TITLE_FREE_TRIAL_ENDED);
    }
  };
  const handleCloseDialog = () => {
    setVaultNotificationsStatus({
      notificationName: "hasSeenFreeUserFrozenState",
      isEnabled: true,
    });
    onClose();
  };
  const handleClickFreeCTA = () => {
    logEvent(
      new UserClickEvent({
        button: isUserFrozen.data ? Button.ManageLogins : Button.RemainFree,
        clickOrigin: ClickOrigin.FrozenAccountModal,
      })
    );
    setVaultNotificationsStatus({
      notificationName: "hasSeenFreeUserFrozenState",
      isEnabled: true,
    });
    onClose();
  };
  const handleClickOnPremium = () => {
    logEvent(
      new UserClickEvent({
        button: Button.UpgradePremiumPlan,
        clickOrigin: ClickOrigin.FrozenAccountModal,
      })
    );
    setVaultNotificationsStatus({
      notificationName: "hasSeenFreeUserFrozenState",
      isEnabled: true,
    });
    openDashlaneUrl(GET_PREMIUM_URL, {
      type: "upgrade",
      action: "unfreezeVault",
    });
  };
  const handleClickOnFriendsFamily = () => {
    logEvent(
      new UserClickEvent({
        button: Button.UpgradeFriendsAndFamilyPlan,
        clickOrigin: ClickOrigin.FrozenAccountModal,
      })
    );
    setVaultNotificationsStatus({
      notificationName: "hasSeenFreeUserFrozenState",
      isEnabled: true,
    });
    openDashlaneUrl(GET_PREMIUM_FAMILY_URL, {
      type: "upgrade",
      action: "unfreezeVault",
    });
  };
  return (
    <Dialog
      sx={{ maxWidth: "860px" }}
      isOpen
      onClose={handleCloseDialog}
      title={getTitle()}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
    >
      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Paragraph
          sx={{ marginBottom: "5px" }}
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate(
            isUserFrozen.data
              ? I18N_KEYS.DESCRIPTION_FROZEN
              : I18N_KEYS.DESCRIPTION_LIMITED
          )}
        </Paragraph>

        <div sx={{ display: "flex", gap: "15px" }}>
          <PlanContainer
            planTitle={translate(I18N_KEYS.FREE_PLAN_TITLE)}
            price={`${currency === "eur" ? "€" : "$"}0`}
            button={{
              onClick: handleClickFreeCTA,
              label: isUserFrozen.data
                ? translate(I18N_KEYS.MANAGE_LOGINS_BUTTON)
                : translate(I18N_KEYS.KEEP_FREE_BUTTON),
              intensity: isUserFrozen.data ? "quiet" : null,
              isLink: true,
              route: routes.userCredentials,
            }}
            featuresTitle={translate(I18N_KEYS.FREE_PLAN_FEATURES_TITLE)}
            featureList={getFreeFeatureList(translate)}
            infoBox={{
              title: translate(
                isUserFrozen.data
                  ? I18N_KEYS.INFOBOX_TITLE_FROZEN
                  : I18N_KEYS.INFOBOX_TITLE_LIMITED
              ),
              description: translate(
                isUserFrozen.data
                  ? I18N_KEYS.INFOBOX_DESCRIPTION_FROZEN
                  : I18N_KEYS.INFOBOX_DESCRIPTION_LIMITED
              ),
              mood: isUserFrozen.data ? "warning" : "brand",
            }}
          />

          <PlanContainer
            planTitle={translate(I18N_KEYS.PREMIUM_PLAN_TITLE)}
            price={`${currency === "eur" ? "€" : "$"}${
              premium.offers[0].price
            }`}
            periodicity={getPeriodicityLabelOfPlan(
              premium.offers[0].billingPeriod.periodicity,
              false,
              translate
            )}
            button={{
              label: translate(I18N_KEYS.UPGRADE_BUTTON),
              onClick: handleClickOnPremium,
            }}
            featuresTitle={translate(I18N_KEYS.PREMIUM_FEATURES_TITLE)}
            featureList={getPremiumFeatureList(translate)}
          />

          <PlanContainer
            planTitle={translate(I18N_KEYS.FAMILY_FRIENDS_PLAN_TITLE)}
            periodicity={getPeriodicityLabelOfPlan(
              premium.offers[0].billingPeriod.periodicity,
              true,
              translate
            )}
            price={`${currency === "eur" ? "€" : "$"}${family.offers[0].price}`}
            button={{
              onClick: handleClickOnFriendsFamily,
              label: translate(I18N_KEYS.UPGRADE_BUTTON),
            }}
            featuresTitle={translate(I18N_KEYS.FAMILY_FRIENDS_FEATURES_TITLE)}
            featureList={getFamilyFeatureList(translate)}
          />
        </div>

        <LinkButton href={GET_CURRENT_FREE_PLAN_URL} isExternal>
          {translate(I18N_KEYS.COMPARE_PLANS_BUTTON)}
        </LinkButton>
      </div>
    </Dialog>
  );
};
