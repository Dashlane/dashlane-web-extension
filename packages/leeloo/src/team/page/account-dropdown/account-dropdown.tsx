import { useState } from "react";
import {
  Button as ButtonType,
  ClickOrigin,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  Badge,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { ACCOUNT_REFERRAL_FEATURE_FLIPS } from "@dashlane/account-contracts";
import { Lee } from "../../../lee";
import { openUrl } from "../../../libs/external-urls";
import { useLogout } from "../../../libs/hooks/useLogout";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { useLogPageViewContext } from "../../../libs/logs/log-page-view-context";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { NavigateTacVaultDialog } from "../../../webapp/navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import { Feedback } from "../feedback";
import { ContactSupportDialog } from "../support/contact-support-dialog";
import {
  BUSINESS_BUY,
  BUSINESS_SUPPORT,
  DASHLANE_B2B_REFERRAL,
  SERVICE_STATUS,
} from "../../urls";
import { TrialBadge } from "./trial-badge";
import styles from "./styles.css";
export interface Props {
  lee: Lee;
}
const I18N_KEYS = {
  ACCOUNT: "team_account",
  BUY_DASHLANE: "team_buy_dashlane",
  CONTACT_SUPPORT: "team_contact_support_menu_item",
  FEEDBACK: "team_feedback",
  LOGOUT: "team_logout",
  PLAN: "team_plan",
  REFER_A_BUSINESS: "team_refer_business",
  SERVICE_STATUS: "team_service_status",
  SUPPORT: "team_support",
  WEBAPP: "team_webapp",
  UPGRADE: "team_upgrade",
  OFFER_BADGE: "team_offer_badge",
};
export const BADGE_END_DATE = 1739145600000;
export const TeamAccountDropdown = ({ lee }: Props) => {
  const [feedbackDialogIsOpen, setFeedbackDialogIsOpen] = useState(false);
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const [openNavigationModal, setOpenNavigationModal] = useState(false);
  const featureFlipsResult = useFeatureFlips();
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data["monetization_extension_post_trial_checkout"];
  const isB2bReferralEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data[ACCOUNT_REFERRAL_FEATURE_FLIPS.B2bReferralDev];
  const teamTrialStatus = useTeamTrialStatus();
  const subscriptionCode = useSubscriptionCode();
  const { translate } = useTranslate();
  const logout = useLogout(lee.dispatchGlobal);
  const currentPageView = useLogPageViewContext();
  const { routes } = useRouterGlobalSettingsContext();
  const onLogoutClick = () => {
    logout();
  };
  const onOpenWebappClick = () => {
    if (APP_PACKAGED_IN_EXTENSION) {
      redirect("/");
    } else {
      setOpenNavigationModal(true);
    }
  };
  const feedbackDialog = feedbackDialogIsOpen ? (
    <Feedback
      onDismiss={() => setFeedbackDialogIsOpen(false)}
      onSend={() => setFeedbackDialogIsOpen(false)}
    />
  ) : null;
  const supportDialog = supportDialogIsOpen ? (
    <ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)} />
  ) : null;
  const isStarterOrTeamPlan =
    !teamTrialStatus?.isFreeTrial &&
    (teamTrialStatus?.spaceTier === SpaceTier.Team ||
      teamTrialStatus?.spaceTier === SpaceTier.Starter);
  const planParam =
    teamTrialStatus?.spaceTier === SpaceTier.Team ? "team" : "business";
  const isTeamBusinessTrial = teamTrialStatus?.isFreeTrial;
  const hasBillingAccess = lee.permission.adminAccess.hasBillingAccess;
  const utmParam = `button:buy_dashlane+click_origin:account_dropdown+origin_page:${
    currentPageView || undefined
  }+origin_component:main_app`;
  const buyDashlaneLink = `${BUSINESS_BUY}?plan=${planParam}&subCode=${
    subscriptionCode ?? ""
  }&utm_source=${utmParam}`;
  const handleClickOnBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: ButtonType.BuyDashlane,
        clickOrigin: ClickOrigin.AccountDropdown,
      })
    );
    if (isPostTrialCheckoutEnabled) {
      redirect(routes.teamAccountCheckoutRoutePath);
    } else {
      openUrl(buyDashlaneLink);
    }
  };
  const handleGoToB2BReferral = () => {
    logEvent(
      new UserClickEvent({
        button: ButtonType.ReferABusiness,
        clickOrigin: ClickOrigin.AccountDropdown,
      })
    );
    const utmParams =
      "utm_source=product&utm_medium=tac&utm_campaign=b2breferralprogram";
    openUrl(`${DASHLANE_B2B_REFERRAL}?${utmParams}`);
  };
  const currentTimestamp = Date.now();
  const showReferralBadge = currentTimestamp <= BADGE_END_DATE;
  return (
    <>
      <div className={styles.teamAccountDropdown}>
        <DropdownMenu align="end">
          <div className={styles.dropdownMenu}>
            <DropdownTriggerButton
              showCaret={true}
              mood="neutral"
              intensity="supershy"
              sx={{ zIndex: 99 }}
            >
              {translate(I18N_KEYS.ACCOUNT)}
            </DropdownTriggerButton>
            <DropdownContent>
              {isTeamBusinessTrial && hasBillingAccess ? (
                <DropdownItem
                  onSelect={handleClickOnBuyDashlane}
                  label={translate(I18N_KEYS.BUY_DASHLANE)}
                  badge={<TrialBadge />}
                />
              ) : null}
              {hasBillingAccess ? (
                <DropdownItem
                  onSelect={() => redirect(routes.teamAccountRoutePath)}
                  label={translate(I18N_KEYS.PLAN)}
                />
              ) : null}

              <DropdownItem
                onSelect={onOpenWebappClick}
                label={translate(I18N_KEYS.WEBAPP)}
              />
              {isB2bReferralEnabled && hasBillingAccess ? (
                <DropdownItem
                  onSelect={handleGoToB2BReferral}
                  label={translate(I18N_KEYS.REFER_A_BUSINESS)}
                  badge={
                    showReferralBadge ? (
                      <Badge
                        mood="brand"
                        intensity="quiet"
                        layout="iconLeading"
                        label={translate(I18N_KEYS.OFFER_BADGE)}
                      />
                    ) : undefined
                  }
                />
              ) : null}
              {isStarterOrTeamPlan && hasBillingAccess ? (
                <DropdownItem
                  onSelect={() =>
                    redirect(`${routes.teamAccountChangePlanRoutePath}`)
                  }
                  label={translate(I18N_KEYS.UPGRADE)}
                />
              ) : null}
              <DropdownItem
                onSelect={() => openUrl(SERVICE_STATUS)}
                label={translate(I18N_KEYS.SERVICE_STATUS)}
              />
              <DropdownItem
                onSelect={() => openUrl(BUSINESS_SUPPORT)}
                label={translate(I18N_KEYS.SUPPORT)}
              />
              {hasBillingAccess ? (
                <DropdownItem
                  onSelect={() => setSupportDialogIsOpen(true)}
                  label={translate(I18N_KEYS.CONTACT_SUPPORT)}
                />
              ) : null}

              <DropdownItem
                onSelect={() => setFeedbackDialogIsOpen(true)}
                label={translate(I18N_KEYS.FEEDBACK)}
              />
              <hr
                key="horizontal-divider"
                sx={{
                  border: "none",
                  borderTop: "1px solid ds.border.neutral.quiet.idle",
                  margin: "8px 0",
                  opacity: 0.8,
                }}
              />
              <DropdownItem
                onSelect={onLogoutClick}
                isDestructive
                label={translate(I18N_KEYS.LOGOUT)}
              />
            </DropdownContent>
          </div>
        </DropdownMenu>
      </div>
      {openNavigationModal ? (
        <NavigateTacVaultDialog
          isShown={openNavigationModal}
          setIsShown={setOpenNavigationModal}
          isFromVault={false}
        />
      ) : null}
      {feedbackDialog}
      {supportDialog}
    </>
  );
};
