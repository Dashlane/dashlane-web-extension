import {
  CallToAction,
  PageView,
  UserCallToActionEvent,
} from "@dashlane/hermes";
export enum PAYWALL_TYPE {
  ADD_NEW_NOTE = "add_new_note",
  PREMIUM_PROMPT = "premium_prompt",
  SECURE_NOTE = "secure_note",
}
export enum PAYWALL_SUBTYPE {
  DARKWEB_MONITORING = "dark_web_monitoring",
  PASSWORD_LIMIT = "password_limit",
  SECURE_NOTES = "secure_notes",
  SHARING_LIMIT = "sharing_limit",
  VPN = "vpn",
}
export enum PAYWALL_ACTION {
  ADD_NEW = "add_new",
  CLOSE = "close",
  DISPLAY = "display",
  GO_ESSENTIALS = "go_essentials",
  GO_PLANS = "go_plans",
  GO_PREMIUM = "go_premium",
  PREMIUM_PROMPT = "premium_prompt",
}
export const panelToPageView: Record<PAYWALL_SUBTYPE, PageView> = {
  [PAYWALL_SUBTYPE.SECURE_NOTES]: PageView.PaywallSecureNotes,
  [PAYWALL_SUBTYPE.DARKWEB_MONITORING]: PageView.PaywallDarkWebMonitoring,
  [PAYWALL_SUBTYPE.VPN]: PageView.PaywallVpn,
  [PAYWALL_SUBTYPE.PASSWORD_LIMIT]: PageView.PaywallPasswordLimit,
  [PAYWALL_SUBTYPE.SHARING_LIMIT]: PageView.PaywallSharingLimit,
};
export const cancelPaywallLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.AllOffers, CallToAction.PremiumOffer],
  hasChosenNoAction: true,
});
export const upGradeToPremiumLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.AllOffers, CallToAction.PremiumOffer],
  hasChosenNoAction: false,
  chosenAction: CallToAction.PremiumOffer,
});
export const seeAllPlansLog = new UserCallToActionEvent({
  callToActionList: [CallToAction.AllOffers, CallToAction.PremiumOffer],
  hasChosenNoAction: false,
  chosenAction: CallToAction.AllOffers,
});
