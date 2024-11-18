import { WebOnboardingModeEvent } from "@dashlane/communication";
export enum LogType {
  Login = "login",
  Credentials = "credentials",
  SecureNotes = "secureNotes",
  Detail = "detail",
  DarkWebMonitoringNotification = "darkWebMonitoringNotification",
  MoreTools = "moreTools",
  Items = "items",
  Menu = "menu",
  Footer = "footer",
  Generator = "generator",
  Website = "website",
  AutofillSettings = "autofill",
  GeneratorHistory = "generatorHistory",
  WinbackOffer = "winbackOffer",
  PaymentFailureVault = "paymentFailureVault",
  PaymentFailureRedDot = "PaymentFailureRedDot",
  PostGraceVault = "PostGraceVault",
  MultipleDevicesLimit = "device_sync_limit",
  PaidPromptBanner = "paid_prompt_banner",
}
export interface BaseLog {
  type: LogType;
  action: string;
}
export enum LoginAction {
  InitializeLoginProcess = "61.0.0",
  SubmitEmail = "61.0.3",
  SubmitToken = "61.3.0",
  DropdownActions = "61.3.2",
  SubmitOTP = "61.4.0",
  SignupClicked = "61.3.2",
  SubmitPassword = "61.4.0",
  CheckRememberMe = "61.4.0.1",
  UncheckRememberMe = "61.4.0.2",
  ClickShowPassword = "61.4.1",
  ClickHidePassword = "61.4.2",
  Error = "61.4.3",
  ForgotPassword = "61.4.4",
  WebAuthnLoginWithBiometrics = "61.1.4",
  WebAuthnUseMasterPassword = "61.1.5",
}
export type ActionDetail =
  | "see_welcome"
  | "click_login_welcome"
  | "create_account_welcome"
  | "resend_token"
  | "invalid_token"
  | "create_account"
  | "switch_account"
  | "another_account"
  | "email_error"
  | "token_success"
  | "email_success";
export interface LoginLogContent {
  action: ActionDetail;
  sender: "popover";
  twoFactorAuth?: boolean;
  details?: string;
}
export enum CredentialsAction {
  GoToWebsite = "goToWebsite",
  GoToDetail = "goToDetail",
  EditCredential = "editCredential",
  CopyPassword = "copyPassword",
  CopyLogin = "copyLogin",
  CopyEmail = "copyEmail",
  CopyOTP = "copyOTP",
  CopySecondaryLogin = "copySecondaryLogin",
  OpenDropdown = "openDropdown",
  CopyPasswordConfirmationBox = "fromCopy-showPasswordConfirmationBox",
  confirmPasswordConfirmationBox = "copyCredentialFromPasswordConfirmationBox",
  cancelPasswordConfirmationBox = "cancelPasswordConfirmationBox",
  wrongPasswordConfirmationBox = "wrongPasswordConfirmationBox",
}
export enum SecureNotesAction {
  GoToDetail = "goToDetail",
  EditNote = "editSecureNote",
}
export enum DarkWebMonitoringNotificationAction {
  Display = "display",
  ViewInformation = "viewInformation",
  NotNow = "notNow",
}
export enum DetailAction {
  EditCredential = "editCredential",
  CopyEmail = "copyEmail",
  CopyLogin = "copyPrimaryLogin",
  CopySecondaryLogin = "copySecondaryLogin",
  CopyOTP = "copyOTP",
  CopyPassword = "copyPassword",
  ShowPassword = "showPassword",
  CopyNote = "copyNote",
  GoToWebsite = "goToWebsite",
  CopyPasswordConfirmationBox = "fromCopy-showPasswordConfirmationBox",
  ShowPasswordConfirmationBox = "fromShow-showPasswordConfirmationBox",
  confirmPasswordConfirmationBox = "copyCredentialFromPasswordConfirmationBox",
  cancelPasswordConfirmationBox = "cancelPasswordConfirmationBox",
  wrongPasswordConfirmationBox = "wrongPasswordConfirmationBox",
}
export enum MoreToolsAction {
  OpenWebApp = "openWebApp",
  OpenTeamConsole = "openTeamConsole",
  ReferFriend = "referFriend",
  DashlaneSupport = "dashlaneSupport",
  Logout = "logout",
}
export enum ItemsAction {
  AddPassword = "addPassword",
  AddPasswordNoResults = "addPasswordNoResults",
  AddSecureNoteNoResults = "addSecureNoteNoResults",
  AddPaymentNoResults = "addPaymentNoResults",
  AddPersonalInfoNoResults = "addPersonalInfoNoResults",
  AddIdNoResults = "addIdNoResults",
  LoginPopupDisplayed = "loginPopupDisplayed",
  OpenExtension = "openExtension",
  SortByName = "sortBy_name",
  SortByLastUsed = "sortBy_lastUsed",
  DismissLoginPopup = "dismissLoginPopup",
}
export enum MenuAction {
  Website = "website",
  Items = "items",
  Generator = "generator",
  MoreTools = "moreTools",
  Footer = "footer",
  AutofillSettings = "autofill",
  Home = "home",
}
export enum FooterAction {
  AddId = "addId",
  AddNote = "addNote",
  AddPassword = "addPassword",
  AddPayment = "addPayment",
  AddPersonalInfo = "addPersonalInfo",
  DashlaneSupport = "dashlaneSupport",
  Help = "help",
  HelpDropdown = "helpDropdown",
  Invite = "invite",
  Logout = "logout",
  OpenApp = "openApp",
  WhatsNew = "whatsNew",
}
export enum GeneratorAction {
  Copy = "copy",
  Fill = "fill",
  ChangeLength = "changeLength",
  Generate = "generate",
  Defaults = "defaults",
  TickSymbols = "tick_symbols",
  UntickSymbols = "untick_symbols",
  TickLetters = "tick_letters",
  UntickLetters = "untick_letters",
  TickAvoidambiguous = "tick_avoidAmbiguous",
  UntickAvoidambiguous = "untick_avoidAmbiguous",
  TickDigits = "tick_digits",
  UntickDigits = "untick_digits",
  ShowPasswordHistory = "showPasswordHistory",
}
export enum WebsiteAction {
  AccountDetails = "accountDetails",
  SwitchSettingsFormAutoFillOnPage = "switch_settingsFormAutoFillOnPage",
  SwitchSettingsAutoLoginOnPage = "switch_settingsAutoLoginOnPage",
  SwitchSettingsDisableDashlaneOnPage = "switch_settingsDisableDashlaneOnPage",
  SwitchSettingsFormAutoFillWholeSite = "switch_settingsFormAutoFillWholeSite",
  SwitchSettingsAutoLoginWholeSite = "switch_settingsAutoLoginWholeSite",
  SwitchSettingsDisableDashlaneWholeSite = "switch_settingsDisableDashlaneWholeSite",
  AddNewPassword = "addNewPassword",
  SettingsForThisPage = "settingsForThisPage",
  SettingsForWholeSite = "settingsForWholeSite",
  GoToWebsite = "goToWebsite",
  OpenItem = "openItem",
  CopyPassword = "copyPassword",
  CopyLogin = "copyLogin",
  CopySecondaryLogin = "copySecondaryLogin",
  CopyEmail = "copyEmail",
  OpenDropdown = "openDropdown",
  CopyPasswordConfirmationBox = "fromCopy-showPasswordConfirmationBox",
  confirmPasswordConfirmationBox = "copyCredentialFromPasswordConfirmationBox",
  cancelPasswordConfirmationBox = "cancelPasswordConfirmationBox",
  wrongPasswordConfirmationBox = "wrongPasswordConfirmationBox",
}
export enum AutofillSettingsAction {
  AccountDetails = "accountDetails",
  MoreInfo = "learnMoreDeactivatedFields",
  MoreInfoEmptyState = "learnMoreNoDeactivatedField",
  RevertOffFields = "revertOffFields",
  SettingsForThisPage = "settingsForThisPage",
  SettingsForWholeSite = "settingsForWholeSite",
  SwitchSettingsAutoLoginOnPage = "switch_settingsOnlyPasswordFormsThisPage",
  SwitchSettingsAutoLoginWholeSite = "switch_settingsOnlyPasswordFormsWholeSite",
  SwitchSettingsDisableDashlaneOnPage = "switch_settingsNoFormThisPage",
  SwitchSettingsDisableDashlaneWholeSite = "switch_settingsNoFormWholeSite",
  SwitchSettingsFormAutoFillOnPage = "switch_settingsAllFormsThisPage",
  SwitchSettingsFormAutoFillWholeSite = "switch_settingsAllFormsWholeSite",
  SwitchSettingsFormAutoFillWholeSiteFromAlert = "turnOnAutofillForWholeSite",
}
export enum GeneratorHistoryAction {
  ShowPassword = "showPassword",
  CopyPassword = "copyPassword",
}
export enum WinbackOfferAction {
  Dismiss = "dismiss",
  Displayed = "displayed",
  GoPremium = "goPremium",
}
export enum PaymentFailureVaultAction {
  Dismiss = "dismiss",
  Displayed = "displayed",
  GoPremium = "goPremium",
}
export enum PaymentFailureRedDotAction {
  ShowExtension = "showExtension",
}
export enum PostGraceVaultAction {
  Dismiss = "dismiss",
  Displayed = "displayed",
  GoPremium = "goPremium",
}
export enum MultipleDevicesLimitAction {
  SEEN = "seen",
  UNLINK_PREVIOUS = "unlink_previous",
  SEE_PREMIUM = "see_premium",
}
export enum PremiumPromptAction {
  DISPLAY = "display",
  GO_ESSENTIALS = "go_essentials",
  GO_PREMIUM = "go_premium",
}
export interface LoginLog extends BaseLog {
  type: LogType.Login;
  action: LoginAction;
  content?: LoginLogContent;
}
export interface CredentialsLog extends BaseLog {
  type: LogType.Credentials;
  action: CredentialsAction;
  website: string;
  subtype?: string;
}
export interface SecureNotesLog extends BaseLog {
  type: LogType.SecureNotes;
  action: SecureNotesAction;
  subtype?: string;
}
export interface DarkWebMonitoringNotificationLog extends BaseLog {
  type: LogType.DarkWebMonitoringNotification;
  action: DarkWebMonitoringNotificationAction;
}
export interface DetailLog extends BaseLog {
  type: LogType.Detail;
  action: DetailAction;
  website: string;
}
export interface MoreToolsLog extends BaseLog {
  type: LogType.MoreTools;
  action: MoreToolsAction;
}
export interface ItemsLog extends BaseLog {
  type: LogType.Items;
  action: ItemsAction;
  subtype?: string;
}
export interface MenuLog extends BaseLog {
  type: LogType.Menu;
  action: MenuAction;
  subType?: string;
}
export interface FooterLog extends BaseLog {
  type: LogType.Footer;
  action: FooterAction;
}
export interface GeneratorLog extends BaseLog {
  type: LogType.Generator;
  action: GeneratorAction;
  website?: string;
}
export interface WebsiteLog extends BaseLog {
  type: LogType.Website;
  action: WebsiteAction;
  website: string;
}
export interface AutofillSettingsLog extends BaseLog {
  type: LogType.AutofillSettings;
  action: AutofillSettingsAction;
  website: string;
}
export interface GeneratedPasswordHistoryLog extends BaseLog {
  type: LogType.GeneratorHistory;
  action: GeneratorHistoryAction;
  website?: string;
}
export interface WinbackOfferLog extends BaseLog {
  type: LogType.WinbackOffer;
  action: WinbackOfferAction;
  from: "notifications" | "details";
}
export interface PaymentFailureVaultLog extends BaseLog {
  type: LogType.PaymentFailureVault;
  action: PaymentFailureVaultAction;
}
export interface PaymentFailureRedDotLog extends BaseLog {
  type: LogType.PaymentFailureRedDot;
  action: PaymentFailureRedDotAction;
}
export interface PostGraceVaultLog extends BaseLog {
  type: LogType.PostGraceVault;
  action: PostGraceVaultAction;
}
export interface MultipleDevicesLog extends BaseLog {
  type: LogType.MultipleDevicesLimit;
  subtype: "limit_prompt";
  action: MultipleDevicesLimitAction;
}
export interface PremiumPromptLog extends BaseLog {
  type: LogType.PaidPromptBanner;
  subtype: "password_limit";
  action: PremiumPromptAction;
}
export type Log =
  | LoginLog
  | CredentialsLog
  | SecureNotesLog
  | DarkWebMonitoringNotificationLog
  | DetailLog
  | MoreToolsLog
  | ItemsLog
  | MenuLog
  | FooterLog
  | GeneratorLog
  | WebsiteLog
  | AutofillSettingsLog
  | GeneratedPasswordHistoryLog
  | WinbackOfferLog
  | PaymentFailureVaultLog
  | PaymentFailureRedDotLog
  | PostGraceVaultLog
  | MultipleDevicesLog
  | PremiumPromptLog;
export const USAGE_LOG_CODE = 51;
export interface UsageLogDetails {
  [k: string]: string | undefined;
}
export interface MakeUsageLogArguments {
  log: Log;
  webOnboardingMode: WebOnboardingModeEvent;
  extensionVersion: string;
}
