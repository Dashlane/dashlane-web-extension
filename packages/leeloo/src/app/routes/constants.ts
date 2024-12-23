import { browser } from "@dashlane/browser-utils";
export enum RoutingSchemeOptions {
  ALL_APPS = "all-apps",
  TEAM_ADMIN_CONSOLE = "teamadminconsole",
  CLIENT = "client",
}
const getPaymentUrl = (url: string, safariUrl = "dashlane:///getpremium") =>
  APP_PACKAGED_IN_EXTENSION && browser.isSafari() ? safariUrl : url;
export const ACCOUNT_RECOVERY_URL_SEGMENT = "/account-recovery";
export const ADMIN_ASSISTED_RECOVERY_URL_SEGMENT = `${ACCOUNT_RECOVERY_URL_SEGMENT}/admin-assisted-recovery`;
export const ACCOUNT_RECOVERY_KEY_URL_SEGMENT = `${ACCOUNT_RECOVERY_URL_SEGMENT}/account-recovery-key`;
export const ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT =
  "/account-recovery-key-result";
export const CHANGE_LOGIN_EMAIL_RESULT_SEGMENT = "/change-login-email-result";
export const CHANGE_LOGIN_EMAIL_SEGMENT = "/change-login-email";
export const ACCOUNT_RECOVERY_KEY_REACTIVATE_SETTINGS =
  "/account-settings?view=recovery-key-reactivate";
export const DEVICE_TRANSFER_SUCCESS_SEGMENT = "/device-transfer-success";
export const TAC_URL_SEGMENT = "/team";
export const CLIENT_TAC_URL_SEGMENT = "/client/console";
export const CLIENT_TAC_LOGIN_URL_SEGMENT = "/client/console/login";
export const TEAM_CONSOLE_URL_SEGMENT = "/console";
export const CLIENT_URL_SEGMENT = "/client";
export const SSO_URL_SEGMENT = "/sso";
export const LOGIN_URL_SEGMENT = "/login";
export const LOGIN_TAC_URL_SEGMENT = "/console/login";
export const ACCOUNT_CREATION_URL_SEGMENT = "/signup";
export const EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT = "/team/signup";
export const ACCOUNT_CREATION_TAC_URL_SEGMENT = "/console/signup";
export const DEPENDENCIES_URL_SEGMENT = "/dependencies";
export const FAMILY_URL_SEGMENT = "/family";
export const LOADER_URL_SEGMENT = "/loader";
export const ONBOARDING_URL_SEGMENT = "/onboarding";
export const CHROME_WELCOME_URL_SEGMENT = "/chrome-welcome";
export const AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT = "/auto-login-sso-success";
export const DELETE_ACCOUNT_URL_SEGMENT = "/delete-account";
export const RESET_ACCOUNT_URL_SEGMENT = "/reset-account";
export const RECOVER_2FA_CODES_URL_SEGMENT = "/recover-2fa-codes";
export const GET_PLANS_URL = getPaymentUrl("__REDACTED__");
export const GET_ADVANCED_URL = getPaymentUrl("__REDACTED__");
export const GET_ESSENTIALS_URL = getPaymentUrl("__REDACTED__");
export const GET_PREMIUM_URL = getPaymentUrl("__REDACTED__");
export const GET_PREMIUM_FAMILY_URL = getPaymentUrl("__REDACTED__");
export const EDIT_PRIVACY_URL = "__REDACTED__";
export const REFERRAL_URL = "__REDACTED__";
export const FEATURES_URL = "__REDACTED__";
export const GET_CURRENT_FREE_PLAN_URL = "__REDACTED__";
export const ACCOUNT_RESET_INFO_URL = "__REDACTED__";
export const PRIVACY_URL = "__REDACTED__";
export const TERMS_URL = "__REDACTED__";
export const DASHLANE_UPDATE_PAYMENT_DETAILS_DOMAIN = "__REDACTED__";
export const DASHLANE_UPDATE_PAYMENT_DETAILS_B2B = "__REDACTED__";
export const DASHLANE_UPDATE_PAYMENT_DETAILS_B2C = "__REDACTED__";
export const DOWNLOAD_DASHLANE_URL = "__REDACTED__";
export const TAC_URL = "__REDACTED__";
export const HELP_CENTER_CONTACT_SUPPORT_URL = "__REDACTED__";
export const HELPCENTER_2FA_URL = "__REDACTED__";
export const HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL = `__REDACTED__`;
export const HELPCENTER_FORGOT_MASTER_PASSWORD_URL = "__REDACTED__";
export const HELPCENTER_ACCOUNT_RECOVERY_URL = "__REDACTED__";
export const HELPCENTER_ADMIN_ASSISTED_ACCOUNT_RECOVERY_URL = "__REDACTED__";
export const HELPCENTER_ACCOUNT_RECOVERY_OPTIONS_URL = "__REDACTED__";
export const HELPCENTER_LASTPASS_GUIDE_URL = "__REDACTED__";
export const HELPCENTER_PIN_UNLOCK_URL = "__REDACTED__";
export const DASHLANE_REQUEST_ADMIN_ASSISTED_RECOVERY = "__REDACTED__";
export const TeamSettingsRoutes = {
  POLICIES: "/policies",
  DUO: "/duo",
  MASTER_PASSWORD_POLICIES: "/master-password-policies",
};
export const TeamIntegrationsRoutes = {
  DIRECTORY_SYNC: "/directory-sync",
  SIEM: "/siem",
  SSO: "/sso",
  NUDGES: "/nudges",
};
export const APP_STORE_BILL_HISTORY = "__REDACTED__";
export const GOOGLE_PLAY_BILL_HISTORY = "__REDACTED__";
export const DASHLANE_DOMAIN = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_WITHDRAW_CONSENT = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_ERASURE = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_ACCESS = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_RECTIFICATION = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_RESTRICTION_PROCESSING = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_DATA_PORTABILITY = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_OBJECT = "__REDACTED__";
export const MAIL_TO_SUPPORT_GDPR_COMPLAINT = "__REDACTED__";
