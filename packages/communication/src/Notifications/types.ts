export enum NotificationName {
  PaymentFailureChurning = "paymentFailureChurning",
  PaymentFailureChurned = "paymentFailureChurned",
  SwitchToMlAnalysisEngine = "switchToMlAnalysisEngine",
  DWMb2bAutoEnrollTooltip = "dWMb2bAutoEnrollTooltip",
  TacGetTheExtensionBanner = "tacGetTheExtensionBanner",
  TacEnableAccountRecoveryBanner = "tacEnableAccountRecoveryBanner",
  TacOnlyOneAdminBanner = "tacOnlyOneAdminBanner",
  TacDarkWebInsightsNewBadge = "tacDarkWebInsightsNewBadge",
  PasswordHistoryBanner = "passwordHistoryBanner",
  SharingCenterDisabledBanner = "sharingCenterDisabledBanner",
  AccountRecoveryAvailableAdminTooltip = "accountRecoveryAvailableAdminTooltip",
  ActivateInviteLink = "activateInviteLink",
  MpToSsoMigrationDoneDialog = "mpToSsoMigrationDoneDialog",
}
export enum NotificationStatus {
  Interacted = "interacted",
  Seen = "seen",
  Unseen = "unseen",
}
export type Notifications = Record<NotificationName, NotificationStatus>;
