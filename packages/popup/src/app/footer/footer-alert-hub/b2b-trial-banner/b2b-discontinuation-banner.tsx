import { useEffect } from "react";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useTeamTrialStatus } from "../../../../libs/hooks/use-team-trial-status";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useFooterAlertHubContext } from "../footer-alert-hub-context";
import { useShowB2BDiscontinuationBanner } from "./use-show-b2b-discontinuation-banner";
import { openTeamAccountCheckout } from "../../../more-tools/helpers";
export const BANNER_UTM_SOURCE_PARAM =
  "button:buy_dashlane+click_origin:banner+origin_page:item/credential/list+origin_component:extension_popup";
const I18N_KEYS = {
  BUY_DASHLANE: "tab/all_items/discontinuation_banner/cta_purchase",
  TRIAL_EXPIRED_BUSINESS:
    "tab/all_items/discontinuation_banner/trial_expired_business",
  TRIAL_EXPIRED_TEAM: "tab/all_items/discontinuation_banner/trial_expired_team",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    marginTop: "auto",
    display: "flex",
    padding: "8px 26px",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "13px",
    fontFamily: "Public Sans",
    lineHeight: "18px",
    height: "40px",
    width: "100%",
    backgroundColor: "ds.container.expressive.danger.quiet.idle",
    color: "ds.text.danger.standard",
  },
  STATUS: {
    strong: {
      fontWeight: "bold",
    },
  },
  CTA: {
    textDecoration: "underline",
    textUnderlineOffset: "1.5px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
export const B2BDiscontinuationBanner = () => {
  const teamTrialStatus = useTeamTrialStatus();
  const { translate } = useTranslate();
  const showDiscontinuationBanner = useShowB2BDiscontinuationBanner();
  const { setIsFooterAlertHubOpen } = useFooterAlertHubContext();
  useEffect(() => {
    return () => {
      setIsFooterAlertHubOpen(false);
    };
  }, []);
  if (showDiscontinuationBanner) {
    setIsFooterAlertHubOpen(true);
  }
  if (!showDiscontinuationBanner) {
    return null;
  }
  if (!teamTrialStatus) {
    return null;
  }
  const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
  const handleClick = () => {
    void logEvent(
      new UserClickEvent({
        button: Button.BuyDashlane,
        clickOrigin: ClickOrigin.Banner,
      })
    );
    void openTeamAccountCheckout();
  };
  return (
    <button role="link" onClick={handleClick} sx={SX_STYLES.CONTAINER}>
      <span sx={SX_STYLES.STATUS}>
        {translate(
          isBusiness
            ? I18N_KEYS.TRIAL_EXPIRED_BUSINESS
            : I18N_KEYS.TRIAL_EXPIRED_TEAM
        )}
      </span>
      <span>&nbsp;</span>
      <span sx={SX_STYLES.CTA}>{translate(I18N_KEYS.BUY_DASHLANE)}</span>
    </button>
  );
};
