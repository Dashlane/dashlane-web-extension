import { useEffect } from "react";
import { jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useShowB2CFrozenState } from "../../../../libs/hooks/use-show-b2c-frozen-state";
import { logEvent } from "../../../../libs/logs/logEvent";
import { openWebAppAndClosePopup } from "../../../helpers";
import { useFooterAlertHubContext } from "../footer-alert-hub-context";
export const BANNER_UTM_SOURCE_PARAM =
  "button:buy_dashlane+click_origin:banner+origin_page:item/credential/list+origin_component:extension_popup";
const I18N_KEYS = {
  GET_MORE_STORAGE: "tab/all_items/frozen_banner/cta_purchase",
  ACCOUNT_IS_READ_ONLY: "tab/all_items/frozen_banner/account_read_only",
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
export const B2CFrozenBanner = () => {
  const showBanner = useShowB2CFrozenState();
  const { translate } = useTranslate();
  const { setIsFooterAlertHubOpen } = useFooterAlertHubContext();
  useEffect(() => {
    return () => {
      setIsFooterAlertHubOpen(false);
    };
  }, []);
  if (showBanner.showB2CFrozenBanner) {
    setIsFooterAlertHubOpen(true);
  }
  if (showBanner.isLoading || !showBanner.showB2CFrozenBanner) {
    return null;
  }
  const handleClick = () => {
    void logEvent(
      new UserClickEvent({
        button: Button.UnfreezeAccount,
        clickOrigin: ClickOrigin.BannerFrozenAccount,
      })
    );
    void openWebAppAndClosePopup({
      route: "/credentials",
      query: { b2cFrozen: "true" },
    });
  };
  return (
    <button role="link" onClick={handleClick} sx={SX_STYLES.CONTAINER}>
      <span sx={SX_STYLES.STATUS}>
        {translate(I18N_KEYS.ACCOUNT_IS_READ_ONLY)}
      </span>
      <span>&nbsp;</span>
      <span sx={SX_STYLES.CTA}>{translate(I18N_KEYS.GET_MORE_STORAGE)}</span>
    </button>
  );
};
