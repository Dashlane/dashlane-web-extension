import { fromUnixTime } from "date-fns";
import { LocaleFormat } from "../../../../libs/i18n/helpers";
import { TranslatorInterface } from "../../../../libs/i18n/types";
import {
  ActivityLog,
  ActivityLogType,
  AlertReceivedForEmail,
  BiometricSignInDisabled,
  ContactEmailChanged,
  DomainRequested,
  DomainValidated,
  EmailAdded,
  EmailRemoved,
  MassDeploymentConfigurationUpdated,
  MasterPasswordMobileReset,
  MasterPasswordMobileResetDisabled,
  MasterPasswordMobileResetEnabled,
  NewBillingPeriodCreated,
  NitroIntegrationAppInstalled,
  NitroIntegrationAppUninstalled,
  NitroSiemActivated,
  NitroSiemDeactivated,
  NitroSiemEdited,
  NitroSsoDomainProvisioned,
  NitroSsoDomainRemoved,
  NitroSsoDomainVerified,
  NudgeConfigured,
  NudgeExecuted,
  SeatsAdded,
  SsoDisabled,
  SsoEnabled,
  TeamNameChanged,
  TwoFactorAuthenticationFailed,
  UserAcceptedCollection,
  UserAcceptedSharingInviteCredential,
  UserAcceptedSharingInviteSecureNote,
  UserAddedCredentialToCollection,
  UserAddedItemToCollection,
  UserAuthenticatedWithPasskey,
  UserCopiedBankAccountField,
  UserCopiedCredentialField,
  UserCopiedCreditCardField,
  UserCopiedSecret,
  UserCopiedSecureNote,
  UserCreatedCollection,
  UserCreatedCredential,
  UserCreatedSecureNote,
  UserDeclinedInviteToUserGroup,
  UserDeletedCollection,
  UserDeletedCredential,
  UserDeletedSecureNote,
  UserDeviceAdded,
  UserDeviceLogin,
  UserDeviceRemoved,
  UserGroupCreated,
  UserGroupDeleted,
  UserGroupRenamed,
  UserImportedCollection,
  UserImportedCredentials,
  UserInvitedToUserGroup,
  UserJoinedUserGroup,
  UserLeftUserGroup,
  UserModifiedCredential,
  UserModifiedSecureNote,
  UserPasswordHealthExcludedItem,
  UserPasswordHealthIncludedItem,
  UserPerformedAutofillCredential,
  UserPerformedAutofillPayment,
  UserReceivedNudge,
  UserRejectedCollection,
  UserRejectedSharingInviteCredential,
  UserRejectedSharingInviteSecureNote,
  UserRemovedCredentialFromCollection,
  UserRemovedFromUserGroup,
  UserRemovedItemFromCollection,
  UserRenamedCollection,
  UserRevealedBankAccountField,
  UserRevealedCredentialField,
  UserRevealedCreditCardField,
  UserRevealedSecret,
  UserRevealedSecureNote,
  UserRevokedGroupFromCollection,
  UserRevokedSharedCredentialEmail,
  UserRevokedSharedCredentialExternal,
  UserRevokedSharedCredentialGroup,
  UserRevokedSharedSecureNoteEmail,
  UserRevokedSharedSecureNoteExternal,
  UserRevokedSharedSecureNoteGroup,
  UserRevokedUserFromCollection,
  UserSharedCollectionWithGroup,
  UserSharedCollectionWithUser,
  UserSharedCredentialWithEmail,
  UserSharedCredentialWithExternal,
  UserSharedCredentialWithGroup,
  UserSharedSecureNoteWithEmail,
  UserSharedSecureNoteWithExternal,
  UserSharedSecureNoteWithGroup,
  UserTypedPassword,
  UserTypedWeakPassword,
  UserUpdatedGroupRoleInCollection,
  UserUpdatedUserRoleInCollection,
} from "@dashlane/risk-monitoring-contracts";
type TranslatorFunction = (
  log: ActivityLog,
  translate: TranslatorInterface
) => string;
export const supportedTypes = Object.values(ActivityLogType);
const I18N_KEYS = {
  USER_INVITED: "team_audit_log_user_invited",
  USER_REINVITED: "team_audit_log_user_reinvited",
  USER_REMOVED: "team_audit_log_user_removed",
  TEAM_CAPTAIN_ADDED: "team_audit_log_team_captain_added",
  TEAM_CAPTAIN_REMOVED: "team_audit_log_team_captain_removed",
  GROUP_MANAGER_ADDED: "team_audit_log_group_manager_added",
  GROUP_MANAGER_REMOVED: "team_audit_log_group_manager_removed",
  MASTER_PASSWORD_RESET_ACCEPTED:
    "team_audit_log_master_password_reset_accepted",
  MASTER_PASSWORD_RESET_REFUSED: "team_audit_log_master_password_reset_refused",
  BILLING_ADMIN_ADDED: "team_audit_log_billing_admin_added",
  BILLING_ADMIN_REMOVED: "team_audit_log_billing_admin_removed",
  USER_GROUP_CREATED: "team_audit_log_user_group_created",
  USER_GROUP_RENAMED: "team_audit_log_user_group_renamed",
  USER_GROUP_DELETED: "team_audit_log_user_group_deleted",
  USER_JOINED_USER_GROUP: "team_audit_log_user_joined_user_group",
  USER_LEFT_USER_GROUP: "team_audit_log_user_left_user_group",
  USER_INVITED_TO_USER_GROUP: "team_audit_log_user_invited_to_user_group",
  USER_DECLINED_INVITE_TO_USER_GROUP:
    "team_audit_log_user_declined_invite_to_user_group",
  USER_REMOVED_FROM_USER_GROUP: "team_audit_log_user_removed_from_user_group",
  SSO_IDP_METADATA_SET: "team_audit_log_sso_idp_metadata_set",
  SSO_SERVICE_PROVIDER_URL_SET: "team_audit_log_sso_service_provider_url_set",
  SSO_ENABLED: "team_audit_log_sso_enabled",
  SSO_DISABLED: "team_audit_log_sso_disabled",
  DOMAIN_REQUESTED: "team_audit_log_domain_requested",
  DOMAIN_VALIDATED: "team_audit_log_domain_validated",
  SENSITIVE_LOGS_ENABLED:
    "team_audit_log_collect_sensitive_data_audit_logs_enabled",
  SENSITIVE_LOGS_DISABLED:
    "team_audit_log_collect_sensitive_data_audit_logs_disabled",
  TEAM_NAME_CHANGED: "team_audit_log_team_name_changed",
  NEW_BILLING_PERIOD_CREATED: "team_audit_log_new_billing_period_created",
  SEATS_ADDED: "team_audit_log_seats_added",
  CONTACT_EMAIL_CHANGED: "team_audit_log_contact_email_changed",
  MASTER_PASSWORD_MOBILE_RESET_ENABLED:
    "team_audit_log_master_password_mobile_reset_enabled",
  MASTER_PASSWORD_MOBILE_RESET_DISABLED:
    "team_audit_log_master_password_mobile_reset_disabled",
  MASTER_PASSWORD_MOBILE_RESET: "team_audit_log_master_password_mobile_reset",
  MASTER_PASSWORD_CHANGED: "team_audit_log_master_password_changed",
  MP_TO_VIEW_PASSWORDS_ENABLED: "team_audit_log_mp_to_view_passwords_enabled",
  MP_TO_VIEW_PASSWORDS_DISABLED: "team_audit_log_mp_to_view_passwords_disabled",
  TWO_FACTOR_AUTHENTICATION_FAILED_OTP:
    "team_audit_log_two_factor_authentication_failed_otp",
  TWO_FACTOR_AUTHENTICATION_FAILED_EMAIL_TOKEN:
    "team_audit_log_two_factor_authentication_failed_token",
  TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_ADDED:
    "team_audit_log_two_factor_authentication_login_method_added",
  TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_REMOVED:
    "team_audit_log_two_factor_authentication_login_method_removed",
  BIOMETRIC_SIGN_IN_DISABLED: "team_audit_log_biometric_sign_in_disabled",
  NITRO_SSO_DOMAIN_PROVISIONED: "team_audit_log_nitro_sso_domain_provisioned",
  NITRO_SSO_DOMAIN_REMOVED: "team_audit_log_nitro_sso_domain_removed",
  NITRO_SSO_DOMAIN_VERIFIED: "team_audit_log_nitro_sso_domain_verified",
  NITRO_SSO_SETUP_STARTED: "team_audit_log_nitro_sso_setup_started",
  NITRO_USER_PROVISIONING_ACTIVATED:
    "team_audit_log_nitro_user_provisioning_activated",
  NITRO_USER_PROVISIONING_DEACTIVATED:
    "team_audit_log_nitro_user_provisioning_deactivated",
  NITRO_GROUP_PROVISIONING_ACTIVATED:
    "team_audit_log_nitro_group_provisioning_activated",
  NITRO_GROUP_PROVISIONING_DEACTIVATED:
    "team_audit_log_nitro_group_provisioning_deactivated",
  NITRO_SIEM_ACTIVATED: "team_audit_log_nitro_siem_activated",
  NITRO_SIEM_DEACTIVATED: "team_audit_log_nitro_siem_deactivated",
  NITRO_SIEM_EDITED: "team_audit_log_nitro_siem_edited",
  DWM_EMAIL_ADDED: "team_audit_log_dwm_email_added",
  DWM_EMAIL_REMOVED: "team_audit_log_dwm_email_removed",
  DWM_ALERT_RECEIVED: "team_audit_log_dwm_alert_received",
  USER_DEVICE_ADDED: "team_audit_log_user_device_added",
  USER_DEVICE_REMOVED: "team_audit_log_user_device_removed",
  USER_DEVICE_LOGIN: "team_audit_log_user_device_login",
  MASTER_PASSWORD_RESET: "team_audit_log_master_password_reset",
  REQUESTED_ACCOUNT_RECOVERY: "team_audit_log_requested_account_recovery",
  COMPLETED_ACCOUT_RECOVERY: "team_audit_log_completed_account_recovery",
  USER_SHARED_CREDENTIAL_WITH_GROUP_FULL_RIGHTS:
    "team_audit_log_user_shared_credential_with_group_full",
  USER_SHARED_CREDENTIAL_WITH_EMAIL_FULL_RIGHTS:
    "team_audit_log_user_shared_credential_with_email_full",
  USER_SHARED_CREDENTIAL_WITH_EXTERNAL_FULL_RIGHTS:
    "team_audit_log_user_shared_credential_with_external_full",
  USER_SHARED_CREDENTIAL_WITH_GROUP_LIMITED_RIGHTS:
    "team_audit_log_user_shared_credential_with_group_limited",
  USER_SHARED_CREDENTIAL_WITH_EMAIL_LIMITED_RIGHTS:
    "team_audit_log_user_shared_credential_with_email_limited",
  USER_SHARED_CREDENTIAL_WITH_EXTERNAL_LIMITED_RIGHTS:
    "team_audit_log_user_shared_credential_with_external_limited",
  USER_SHARED_SECURE_NOTE_WITH_GROUP_FULL_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_group_full",
  USER_SHARED_SECURE_NOTE_WITH_EMAIL_FULL_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_email_full",
  USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_FULL_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_external_full",
  USER_SHARED_SECURE_NOTE_WITH_GROUP_LIMITED_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_group_limited",
  USER_SHARED_SECURE_NOTE_WITH_EMAIL_LIMITED_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_email_limited",
  USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_LIMITED_RIGHTS:
    "team_audit_log_user_shared_secure_note_with_external_limited",
  USER_ACCEPTED_SHARING_INVITE_SECURE_NOTE:
    "team_audit_log_user_accepted_sharing_invite_secure_note",
  USER_REJECTED_SHARING_INVITE_SECURE_NOTE:
    "team_audit_log_user_rejected_sharing_invite_secure_note",
  USER_ACCEPTED_SHARING_INVITE_CREDENTIAL:
    "team_audit_log_user_accepted_sharing_invite_credential",
  USER_REJECTED_SHARING_INVITE_CREDENTIAL:
    "team_audit_log_user_rejected_sharing_invite_credential",
  USER_REVOKED_SHARED_CREDENTIAL_GROUP:
    "team_audit_log_user_revoked_shared_credential_group",
  USER_REVOKED_SHARED_CREDENTIAL_EMAIL:
    "team_audit_log_user_revoked_shared_credential_email",
  USER_REVOKED_SHARED_CREDENTIAL_EXTERNAL:
    "team_audit_log_user_revoked_shared_credential_external",
  USER_REVOKED_SHARED_SECURE_NOTE_GROUP:
    "team_audit_log_user_revoked_shared_secure_note_group",
  USER_REVOKED_SHARED_SECURE_NOTE_EMAIL:
    "team_audit_log_user_revoked_shared_secure_note_email",
  USER_REVOKED_SHARED_SECURE_NOTE_EXTERNAL:
    "team_audit_log_user_revoked_shared_secure_note_external",
  USER_PRIVATE_COLLECTION_CREATED:
    "team_audit_log_user_private_collection_created",
  USER_PRIVATE_COLLECTION_IMPORTED:
    "team_audit_log_user_private_collection_imported",
  USER_PRIVATE_COLLECTION_ADDED_CREDENTIAL:
    "team_audit_log_user_private_collection_added_credential",
  USER_PRIVATE_COLLECTION_ADDED_CREDENTIAL_NO_DOMAIN:
    "team_audit_log_user_private_collection_added_credential_no_domain",
  USER_PRIVATE_COLLECTION_REMOVED:
    "team_audit_log_user_private_collection_removed_credential",
  USER_PRIVATE_COLLECTION_RENAMED:
    "team_audit_log_user_private_collection_renamed",
  USER_PRIVATE_COLLECTION_DELETED:
    "team_audit_log_user_private_collection_deleted",
  USER_SHARED_COLLECTION_SHARED_WITH_USER:
    "team_audit_log_user_shared_collection_shared_with_user",
  USER_SHARED_COLLECTION_SHARED_WITH_GROUP:
    "team_audit_log_user_shared_collection_shared_with_group",
  USER_SHARED_COLLECTION_ACCEPTED:
    "team_audit_log_user_shared_collection_accepted",
  USER_SHARED_COLLECTION_REJECTED:
    "team_audit_log_user_shared_collection_rejected",
  USER_SHARED_COLLECTION_ADDED_CREDENTIAL_ADMIN:
    "team_audit_log_user_shared_collection_added_credential_admin",
  USER_SHARED_COLLECTION_ADDED_CREDENTIAL_ADMIN_NO_DOMAIN:
    "team_audit_log_user_shared_collection_added_credential_admin_no_domain",
  USER_SHARED_COLLECTION_ADDED_CREDENTIAL_LIMITED:
    "team_audit_log_user_shared_collection_added_credential_limited",
  USER_SHARED_COLLECTION_ADDED_CREDENTIAL_LIMITED_NO_DOMAIN:
    "team_audit_log_user_shared_collection_added_credential_limited_no_domain",
  USER_SHARED_COLLECTION_REMOVED_CREDENTIAL:
    "team_audit_log_user_shared_collection_removed_credential",
  USER_SHARED_COLLECTION_UPDATED_GROUP_ROLES:
    "team_audit_log_user_shared_collection_group_roles",
  USER_SHARED_COLLECTION_UPDATED_USER_ROLES:
    "team_audit_log_user_shared_collection_user_roles",
  USER_SHARED_COLLECTION_REVOKED_GROUPS:
    "team_audit_log_user_shared_collection_revoked_groups",
  USER_SHARED_COLLECTION_REVOKED_USER:
    "team_audit_log_user_shared_collection_revoked_user",
  USER_SHARED_COLLECTION_REVOKED_GROUPS_INVITE:
    "team_audit_log_user_shared_collection_revoked_group_invite",
  USER_SHARED_COLLECTION_REVOKED_USER_INVITE:
    "team_audit_log_user_shared_collection_revoked_user_invite",
  USER_CREATED_CREDENTIAL: "team_audit_log_user_created_credential",
  USER_MODIFIED_CREDENTIAL: "team_audit_log_user_modified_credential",
  USER_DELETED_CREDENTIAL: "team_audit_log_user_deleted_credential",
  USER_IMPORTED_CREDENTIALS: {
    ONE: "team_audit_log_user_imported_credentials_one",
    MANY: "team_audit_log_user_imported_credentials_many",
  },
  USER_CREATED_SECURE_NOTE: "team_audit_log_user_created_secure_note",
  USER_MODIFIED_SECURE_NOTE: "team_audit_log_user_modified_secure_note",
  USER_DELETED_SECURE_NOTE: "team_audit_log_user_deleted_secure_note",
  NUDGE_EXECUTED: "team_audit_log_nudge_executed",
  NUDGE_EXECUTED_WITH_FAILURES: "team_audit_log_nudge_executed_with_failures",
  NUDGE_CONFIGURED: "team_audit_log_nudge_configured",
  NITRO_INTEGRATION_APP_INSTALLED:
    "team_audit_log_nitro_integration_app_installed",
  NITRO_INTEGRATION_APP_UNINSTALLED:
    "team_audit_log_nitro_integration_app_uninstalled",
  USER_RECEIVED_NUDGE: "team_audit_log_user_received_nudge",
  NUDGE_NAME_COMPROMISED_PASSWORDS:
    "team_audit_log_nudge_name_compromised_passwords",
  NUDGE_NAME_WEAK_PASSWORDS: "team_audit_log_nudge_name_weak_passwords",
  MASS_DEPLOYMENT_CONFIGURATION_UPDATED:
    "team_audit_log_mass_deployment_configuration_updated",
  USER_TYPED_COMPROMISED_PASSWORD:
    "team_audit_log_user_typed_compromised_password",
  USER_TYPED_WEAK_PASSWORD: "team_audit_log_user_typed_weak_password",
  USER_TYPED_PASSWORD: "team_audit_log_user_typed_password",
  USER_PERFORMED_AUTOFILL_CREDENTIAL: "team_audit_log_user_performed_autofill",
  USER_PERFORMED_AUTOFILL_PAYMENT_CARD:
    "team_audit_log_user_performed_autofill_credit_card",
  USER_PERFORMED_AUTOFILL_BANK_ACCOUNT:
    "team_audit_log_user_performed_autofill_bank_account",
  USER_AUTHENTICATED_WITH_PASSKEY:
    "team_audit_log_user_authenticated_with_passkey",
  USER_REVEALED_CREDENTIAL_FIELD:
    "team_audit_log_user_revealed_credential_field",
  USER_REVEALED_CREDIT_CARD_FIELD:
    "team_audit_log_user_revealed_credit_card_field",
  USER_REVEALED_BANK_ACCOUNT_FIELD:
    "team_audit_log_user_revealed_bank_account_field",
  USER_REVEALED_SECURE_NOTE_FIELD:
    "team_audit_log_user_revealed_secure_note_field",
  USER_REVEALED_SECRET_FIELD: "team_audit_log_user_revealed_secret_field",
  USER_COPIED_CREDENTIAL_FIELD: "team_audit_log_user_copied_credential_field",
  USER_COPIED_CREDIT_CARD_FIELD: "team_audit_log_user_copied_credit_card_field",
  USER_COPIED_BANK_ACCOUNT_FIELD:
    "team_audit_log_user_copied_bank_account_field",
  USER_COPIED_SECURE_NOTE_FIELD: "team_audit_log_user_copied_secure_note_field",
  USER_COPIED_SECRET_FIELD: "team_audit_log_user_copied_secret_field",
  USER_EXCLUDED_ITEM_FROM_PASSWORD_HEALTH:
    "team_audit_log_user_excluded_item_from_password_health",
  USER_INCLUDED_ITEM_IN_PASSWORD_HEALTH:
    "team_audit_log_user_included_item_in_password_health",
  ACTIVE: "team_audit_log_active",
  INACTIVE: "team_audit_log_inactive",
};
const translateNudgeName = (
  nudgeName: string,
  translate: TranslatorInterface
) => {
  switch (nudgeName) {
    case "compromised_passwords":
      return translate(I18N_KEYS.NUDGE_NAME_COMPROMISED_PASSWORDS);
    case "weak_passwords":
      return translate(I18N_KEYS.NUDGE_NAME_WEAK_PASSWORDS);
  }
  return nudgeName;
};
const translateStatus = (status: string, translate: TranslatorInterface) => {
  switch (status) {
    case "active":
      return translate(I18N_KEYS.ACTIVE);
    case "inactive":
      return translate(I18N_KEYS.INACTIVE);
  }
  return status;
};
const logTranslation: Record<ActivityLogType, TranslatorFunction> = {
  [ActivityLogType.UserInvited]: (log, translate) =>
    translate(I18N_KEYS.USER_INVITED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.UserReinvited]: (log, translate) =>
    translate(I18N_KEYS.USER_REINVITED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.UserRemoved]: (log, translate) =>
    translate(I18N_KEYS.USER_REMOVED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.TeamCaptainAdded]: (log, translate) =>
    translate(I18N_KEYS.TEAM_CAPTAIN_ADDED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.TeamCaptainRemoved]: (log, translate) =>
    translate(I18N_KEYS.TEAM_CAPTAIN_REMOVED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.GroupManagerAdded]: (log, translate) =>
    translate(I18N_KEYS.GROUP_MANAGER_ADDED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.GroupManagerRemoved]: (log, translate) =>
    translate(I18N_KEYS.GROUP_MANAGER_REMOVED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.MasterPasswordResetAccepted]: (log, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_RESET_ACCEPTED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.MasterPasswordResetRefused]: (log, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_RESET_REFUSED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.BillingAdminAdded]: (log, translate) =>
    translate(I18N_KEYS.BILLING_ADMIN_ADDED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.BillingAdminRemoved]: (log, translate) =>
    translate(I18N_KEYS.BILLING_ADMIN_REMOVED, {
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.UserGroupCreated]: (log, translate) =>
    translate(I18N_KEYS.USER_GROUP_CREATED, {
      groupName: `**${(log as UserGroupCreated).properties?.group_name}**`,
    }),
  [ActivityLogType.UserGroupRenamed]: (log, translate) =>
    translate(I18N_KEYS.USER_GROUP_RENAMED, {
      newGroupName: `**${(log as UserGroupCreated).properties?.group_name}**`,
      oldGroupName: `**${
        (log as UserGroupRenamed).properties?.old_group_name
      }**`,
    }),
  [ActivityLogType.UserGroupDeleted]: (log, translate) =>
    translate(I18N_KEYS.USER_GROUP_DELETED, {
      groupName: `**${(log as UserGroupDeleted).properties?.group_name}**`,
    }),
  [ActivityLogType.UserJoinedUserGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_JOINED_USER_GROUP, {
      groupName: `**${(log as UserJoinedUserGroup).properties?.group_name}**`,
    }),
  [ActivityLogType.UserLeftUserGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_LEFT_USER_GROUP, {
      groupName: `**${(log as UserLeftUserGroup).properties?.group_name}**`,
    }),
  [ActivityLogType.UserInvitedToUserGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_INVITED_TO_USER_GROUP, {
      groupName: `**${
        (log as UserInvitedToUserGroup).properties?.group_name
      }**`,
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.UserDeclinedInviteToUserGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_DECLINED_INVITE_TO_USER_GROUP, {
      groupName: `**${
        (log as UserDeclinedInviteToUserGroup).properties?.group_name
      }**`,
    }),
  [ActivityLogType.UserRemovedFromUserGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_REMOVED_FROM_USER_GROUP, {
      groupName: `**${
        (log as UserRemovedFromUserGroup).properties?.group_name
      }**`,
      email: `**${log?.properties?.target_login}**`,
    }),
  [ActivityLogType.DomainRequested]: (log, translate) =>
    translate(I18N_KEYS.DOMAIN_REQUESTED, {
      domain: `**${(log as DomainRequested).properties?.domain_url}**`,
    }),
  [ActivityLogType.DomainValidated]: (log, translate) =>
    translate(I18N_KEYS.DOMAIN_VALIDATED, {
      domain: `**${(log as DomainValidated).properties?.domain_url}**`,
    }),
  [ActivityLogType.SensitiveLogsEnabled]: (_, translate) =>
    translate(I18N_KEYS.SENSITIVE_LOGS_ENABLED),
  [ActivityLogType.SensitiveLogsDisabled]: (_, translate) =>
    translate(I18N_KEYS.SENSITIVE_LOGS_DISABLED),
  [ActivityLogType.SsoIdpMetadataSet]: (_, translate) =>
    translate(I18N_KEYS.SSO_IDP_METADATA_SET),
  [ActivityLogType.SsoServiceProviderUrlSet]: (_, translate) =>
    translate(I18N_KEYS.SSO_SERVICE_PROVIDER_URL_SET),
  [ActivityLogType.SsoEnabled]: (log, translate) =>
    translate(
      I18N_KEYS.SSO_ENABLED,
      (log as SsoEnabled).properties?.hosting
        ? {
            hosting: (log as SsoEnabled).properties?.hosting,
          }
        : undefined
    ),
  [ActivityLogType.SsoDisabled]: (log, translate) =>
    translate(
      I18N_KEYS.SSO_DISABLED,
      (log as SsoDisabled).properties?.hosting
        ? {
            hosting: (log as SsoDisabled).properties?.hosting,
          }
        : undefined
    ),
  [ActivityLogType.TeamNameChanged]: (log, translate) =>
    translate(I18N_KEYS.TEAM_NAME_CHANGED, {
      name: `**${(log as TeamNameChanged).properties?.name}**`,
    }),
  [ActivityLogType.NewBillingPeriodCreated]: (log, translate) =>
    translate(I18N_KEYS.NEW_BILLING_PERIOD_CREATED, {
      date: `**${translate.shortDate(
        fromUnixTime(
          (log as NewBillingPeriodCreated).properties?.new_end_date_unix
        ),
        LocaleFormat.L
      )}**`,
    }),
  [ActivityLogType.SeatsAdded]: (log, translate) =>
    translate(I18N_KEYS.SEATS_ADDED, {
      count: `**${(log as SeatsAdded).properties?.seats_added}**`,
    }),
  [ActivityLogType.ContactEmailChanged]: (log, translate) =>
    translate(I18N_KEYS.CONTACT_EMAIL_CHANGED, {
      email: `**${
        (log as ContactEmailChanged)?.properties?.new_contact_email
      }**`,
    }),
  [ActivityLogType.MasterPasswordMobileResetEnabled]: (log, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET_ENABLED, {
      deviceName: (log as MasterPasswordMobileResetEnabled)?.properties
        ?.device_name
        ? `**${
            (log as MasterPasswordMobileResetEnabled)?.properties?.device_name
          }**`
        : "mobile",
    }),
  [ActivityLogType.MasterPasswordMobileResetDisabled]: (log, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET_DISABLED, {
      deviceName: (log as MasterPasswordMobileResetDisabled)?.properties
        ?.device_name
        ? `**${
            (log as MasterPasswordMobileResetDisabled)?.properties?.device_name
          }**`
        : "mobile",
    }),
  [ActivityLogType.MasterPasswordChanged]: (_, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_CHANGED),
  [ActivityLogType.MpToViewPasswordsEnabled]: (_, translate) =>
    translate(I18N_KEYS.MP_TO_VIEW_PASSWORDS_ENABLED),
  [ActivityLogType.MpToViewPasswordsDisabled]: (_, translate) =>
    translate(I18N_KEYS.MP_TO_VIEW_PASSWORDS_DISABLED),
  [ActivityLogType.TwoFactorAuthenticationLoginMethodAdded]: (_, translate) =>
    translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_ADDED),
  [ActivityLogType.TwoFactorAuthenticationFailed]: (log, translate) =>
    translate(
      (log as TwoFactorAuthenticationFailed).properties.two_factor_method ===
        "emailToken"
        ? I18N_KEYS.TWO_FACTOR_AUTHENTICATION_FAILED_EMAIL_TOKEN
        : I18N_KEYS.TWO_FACTOR_AUTHENTICATION_FAILED_OTP
    ),
  [ActivityLogType.TwoFactorAuthenticationLoginMethodRemoved]: (_, translate) =>
    translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_REMOVED),
  [ActivityLogType.BiometricSignInDisabled]: (log, translate) =>
    translate(I18N_KEYS.BIOMETRIC_SIGN_IN_DISABLED, {
      deviceName: `**${
        (log as BiometricSignInDisabled)?.properties?.device_name
      }**`,
    }),
  [ActivityLogType.NitroSsoSetupStarted]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SSO_SETUP_STARTED),
  [ActivityLogType.NitroSsoDomainProvisioned]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SSO_DOMAIN_PROVISIONED, {
      domain: `**${
        (log as NitroSsoDomainProvisioned)?.properties?.domain_url
      }**`,
    }),
  [ActivityLogType.NitroSsoDomainRemoved]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SSO_DOMAIN_REMOVED, {
      domain: `**${(log as NitroSsoDomainRemoved)?.properties?.domain_url}**`,
    }),
  [ActivityLogType.NitroSsoDomainVerified]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SSO_DOMAIN_VERIFIED, {
      domain: `**${(log as NitroSsoDomainVerified)?.properties?.domain_url}**`,
    }),
  [ActivityLogType.NitroUserProvisioningActivated]: (_, translate) =>
    translate(I18N_KEYS.NITRO_USER_PROVISIONING_ACTIVATED),
  [ActivityLogType.NitroUserProvisioningDeactivated]: (_, translate) =>
    translate(I18N_KEYS.NITRO_USER_PROVISIONING_DEACTIVATED),
  [ActivityLogType.NitroGroupProvisioningActivated]: (_, translate) =>
    translate(I18N_KEYS.NITRO_GROUP_PROVISIONING_ACTIVATED),
  [ActivityLogType.NitroGroupProvisioningDeactivated]: (_, translate) =>
    translate(I18N_KEYS.NITRO_GROUP_PROVISIONING_DEACTIVATED),
  [ActivityLogType.NitroSiemActivated]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SIEM_ACTIVATED, {
      siemType: `**${(log as NitroSiemActivated).properties.siem_type}**`,
    }),
  [ActivityLogType.NitroSiemDeactivated]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SIEM_DEACTIVATED, {
      siemType: `**${(log as NitroSiemDeactivated).properties.siem_type}**`,
    }),
  [ActivityLogType.NitroSiemEdited]: (log, translate) =>
    translate(I18N_KEYS.NITRO_SIEM_EDITED, {
      siemType: `**${(log as NitroSiemEdited).properties.siem_type}**`,
    }),
  [ActivityLogType.DWMEmailAdded]: (log, translate) =>
    translate(I18N_KEYS.DWM_EMAIL_ADDED, {
      email: `**${
        (log as EmailAdded)?.properties?.dark_web_monitoring_email
      }**`,
    }),
  [ActivityLogType.DWMEmailRemoved]: (log, translate) =>
    translate(I18N_KEYS.DWM_EMAIL_REMOVED, {
      email: `**${
        (log as EmailRemoved)?.properties?.dark_web_monitoring_email
      }**`,
    }),
  [ActivityLogType.DWMAlertReceived]: (log, translate) =>
    translate(I18N_KEYS.DWM_ALERT_RECEIVED, {
      email: `**${
        (log as AlertReceivedForEmail)?.properties?.dark_web_monitoring_email
      }**`,
    }),
  [ActivityLogType.UserDeviceAdded]: (log, translate) =>
    translate(I18N_KEYS.USER_DEVICE_ADDED, {
      name: `**${(log as UserDeviceAdded).properties?.device_name}**`,
    }),
  [ActivityLogType.UserDeviceRemoved]: (log, translate) =>
    translate(I18N_KEYS.USER_DEVICE_REMOVED, {
      name: `**${(log as UserDeviceRemoved).properties?.device_name}**`,
    }),
  [ActivityLogType.UserDeviceLogin]: (log, translate) =>
    translate(I18N_KEYS.USER_DEVICE_LOGIN, {
      name: `**${(log as UserDeviceLogin).properties?.device_name}**`,
    }),
  [ActivityLogType.MasterPasswordReset]: (_, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_RESET),
  [ActivityLogType.RequestedAccountRecovery]: (_, translate) =>
    translate(I18N_KEYS.REQUESTED_ACCOUNT_RECOVERY),
  [ActivityLogType.CompletedAccountRecovery]: (_, translate) =>
    translate(I18N_KEYS.COMPLETED_ACCOUT_RECOVERY),
  [ActivityLogType.MasterPasswordMobileReset]: (log, translate) =>
    translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET, {
      deviceName: (log as MasterPasswordMobileReset)?.properties?.device_name
        ? `**${(log as MasterPasswordMobileReset)?.properties?.device_name}**`
        : "mobile",
    }),
  [ActivityLogType.UserSharedCredentialWithGroup]: (log, translate) => {
    const activityLog = log as UserSharedCredentialWithGroup;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_GROUP_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_GROUP_LIMITED_RIGHTS;
    return translate(translationKey, {
      domain: `**${activityLog.properties.domain_url}**`,
      group: `**${activityLog.properties.group_name}**`,
    });
  },
  [ActivityLogType.UserSharedCredentialWithEmail]: (log, translate) => {
    const activityLog = log as UserSharedCredentialWithEmail;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EMAIL_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EMAIL_LIMITED_RIGHTS;
    return translate(translationKey, {
      domain: `**${activityLog.properties.domain_url}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserSharedCredentialWithExternal]: (log, translate) => {
    const activityLog = log as UserSharedCredentialWithExternal;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EXTERNAL_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EXTERNAL_LIMITED_RIGHTS;
    return translate(translationKey, {
      domain: `**${activityLog.properties.domain_url}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserSharedSecureNoteWithGroup]: (log, translate) => {
    const activityLog = log as UserSharedSecureNoteWithGroup;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_GROUP_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_GROUP_LIMITED_RIGHTS;
    return translate(translationKey, {
      name: `**${activityLog.properties.item_name}**`,
      group: `**${activityLog.properties.group_name}**`,
    });
  },
  [ActivityLogType.UserSharedSecureNoteWithEmail]: (log, translate) => {
    const activityLog = log as UserSharedSecureNoteWithEmail;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EMAIL_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EMAIL_LIMITED_RIGHTS;
    return translate(translationKey, {
      name: `**${activityLog.properties.item_name}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserSharedSecureNoteWithExternal]: (log, translate) => {
    const activityLog = log as UserSharedSecureNoteWithExternal;
    const translationKey =
      activityLog.properties.permission === "admin"
        ? I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_FULL_RIGHTS
        : I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_LIMITED_RIGHTS;
    return translate(translationKey, {
      name: `**${activityLog.properties.item_name}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedCredentialGroup]: (log, translate) => {
    const activityLog = log as UserRevokedSharedCredentialGroup;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_CREDENTIAL_GROUP, {
      domain: `**${activityLog.properties.domain_url}**`,
      group: `**${activityLog.properties.group_name}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedCredentialEmail]: (log, translate) => {
    const activityLog = log as UserRevokedSharedCredentialEmail;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_CREDENTIAL_EMAIL, {
      domain: `**${activityLog.properties.domain_url}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedCredentialExternal]: (log, translate) => {
    const activityLog = log as UserRevokedSharedCredentialExternal;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_CREDENTIAL_EXTERNAL, {
      domain: `**${activityLog.properties.domain_url}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedSecureNoteGroup]: (log, translate) => {
    const activityLog = log as UserRevokedSharedSecureNoteGroup;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_SECURE_NOTE_GROUP, {
      name: `**${activityLog.properties.item_name}**`,
      group: `**${activityLog.properties.group_name}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedSecureNoteEmail]: (log, translate) => {
    const activityLog = log as UserRevokedSharedSecureNoteEmail;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_SECURE_NOTE_EMAIL, {
      name: `**${activityLog.properties.item_name}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserRevokedSharedSecureNoteExternal]: (log, translate) => {
    const activityLog = log as UserRevokedSharedSecureNoteExternal;
    return translate(I18N_KEYS.USER_REVOKED_SHARED_SECURE_NOTE_EXTERNAL, {
      name: `**${activityLog.properties.item_name}**`,
      email: `**${activityLog.properties.target_login}**`,
    });
  },
  [ActivityLogType.UserAcceptedSharingInviteSecureNote]: (log, translate) =>
    translate(I18N_KEYS.USER_ACCEPTED_SHARING_INVITE_SECURE_NOTE, {
      name: `**${
        (log as UserAcceptedSharingInviteSecureNote).properties.item_name
      }**`,
    }),
  [ActivityLogType.UserRejectedSharingInviteSecureNote]: (log, translate) =>
    translate(I18N_KEYS.USER_REJECTED_SHARING_INVITE_SECURE_NOTE, {
      name: `**${
        (log as UserRejectedSharingInviteSecureNote).properties.item_name
      }**`,
    }),
  [ActivityLogType.UserAcceptedSharingInviteCredential]: (log, translate) =>
    translate(I18N_KEYS.USER_ACCEPTED_SHARING_INVITE_CREDENTIAL, {
      domain: `**${
        (log as UserAcceptedSharingInviteCredential).properties.domain_url
      }**`,
    }),
  [ActivityLogType.UserRejectedSharingInviteCredential]: (log, translate) =>
    translate(I18N_KEYS.USER_REJECTED_SHARING_INVITE_CREDENTIAL, {
      domain: `**${
        (log as UserRejectedSharingInviteCredential).properties.domain_url
      }**`,
    }),
  [ActivityLogType.UserCreatedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_CREATED, {
      user: `${(log as UserCreatedCollection).properties.author_login}`,
      name: `**${(log as UserCreatedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserImportedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_IMPORTED, {
      user: `${(log as UserImportedCollection).properties.author_login}`,
      number: `${(log as UserImportedCollection).properties.credential_count}`,
      collection: `**${
        (log as UserImportedCollection).properties.collection_name
      }**`,
    }),
  [ActivityLogType.UserAddedCredentialToCollection]: (log, translate) => {
    if ((log as UserAddedCredentialToCollection).properties.domain_url) {
      return translate(I18N_KEYS.USER_PRIVATE_COLLECTION_ADDED_CREDENTIAL, {
        user: `${
          (log as UserAddedCredentialToCollection).properties.author_login
        }`,
        domain: `**${
          (log as UserAddedCredentialToCollection).properties.domain_url
        }**`,
        name: `**${
          (log as UserAddedCredentialToCollection).properties.collection_name
        }**`,
      });
    }
    return translate(
      I18N_KEYS.USER_PRIVATE_COLLECTION_ADDED_CREDENTIAL_NO_DOMAIN,
      {
        user: `${
          (log as UserAddedCredentialToCollection).properties.author_login
        }`,
        name: `**${
          (log as UserAddedCredentialToCollection).properties.collection_name
        }**`,
      }
    );
  },
  [ActivityLogType.UserRemovedCredentialFromCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_REMOVED, {
      user: `${
        (log as UserRemovedCredentialFromCollection).properties.author_login
      }`,
      domain: `**${
        (log as UserRemovedCredentialFromCollection).properties.domain_url
      }**`,
      name: `**${
        (log as UserRemovedCredentialFromCollection).properties.collection_name
      }**`,
    }),
  [ActivityLogType.UserRenamedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_RENAMED, {
      user: `${(log as UserRenamedCollection).properties.author_login}`,
      old: `**${
        (log as UserRenamedCollection).properties.old_collection_name
      }**`,
      new: `**${(log as UserRenamedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserDeletedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_DELETED, {
      user: `${(log as UserDeletedCollection).properties.author_login}`,
      name: `**${(log as UserDeletedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserSharedCollectionWithUser]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_SHARED_WITH_USER, {
      user: `${(log as UserSharedCollectionWithUser).properties.author_login}`,
      name: `**${
        (log as UserSharedCollectionWithUser).properties.collection_name
      }**`,
      role: `${(log as UserSharedCollectionWithUser).properties.permission}`,
      email: `${(log as UserSharedCollectionWithUser).properties.target_login}`,
    }),
  [ActivityLogType.UserSharedCollectionWithGroup]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_SHARED_WITH_GROUP, {
      user: `${(log as UserSharedCollectionWithGroup).properties.author_login}`,
      name: `**${
        (log as UserSharedCollectionWithGroup).properties.collection_name
      }**`,
      role: `${(log as UserSharedCollectionWithGroup).properties.permission}`,
      group: `${(log as UserSharedCollectionWithGroup).properties.group_name}`,
    }),
  [ActivityLogType.UserAcceptedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_ACCEPTED, {
      user: `${(log as UserAcceptedCollection).properties.author_login}`,
      name: `**${(log as UserAcceptedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserRejectedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_REJECTED, {
      user: `${(log as UserRejectedCollection).properties.author_login}`,
      name: `**${(log as UserRejectedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserAddedItemToCollection]: (log, translate) => {
    const I18NKeyPrefix = "USER_SHARED_COLLECTION_ADDED_CREDENTIAL";
    const permissionSuffix =
      (log as UserAddedItemToCollection).properties.permission === "admin"
        ? "_ADMIN"
        : "_LIMITED";
    const I18NKeyName = `${I18NKeyPrefix}${permissionSuffix}`;
    if ((log as UserAddedCredentialToCollection).properties.domain_url) {
      return translate(I18N_KEYS[I18NKeyName], {
        user: `${(log as UserAddedItemToCollection).properties.author_login}`,
        domain: `**${
          (log as UserAddedItemToCollection).properties.domain_url
        }**`,
        rights: `${(log as UserAddedItemToCollection).properties.permission}`,
        name: `**${
          (log as UserAddedItemToCollection).properties.collection_name
        }**`,
      });
    }
    return translate(I18N_KEYS[I18NKeyName + "_NO_DOMAIN"], {
      user: `${(log as UserAddedItemToCollection).properties.author_login}`,
      rights: `${(log as UserAddedItemToCollection).properties.permission}`,
      name: `**${
        (log as UserAddedItemToCollection).properties.collection_name
      }**`,
    });
  },
  [ActivityLogType.UserRemovedItemFromCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_REMOVED_CREDENTIAL, {
      user: `${(log as UserRemovedItemFromCollection).properties.author_login}`,
      domain: `**${
        (log as UserRemovedItemFromCollection).properties.domain_url
      }**`,
      name: `**${
        (log as UserRemovedItemFromCollection).properties.collection_name
      }**`,
    }),
  [ActivityLogType.UserUpdatedGroupRoleInCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_UPDATED_GROUP_ROLES, {
      user: `${
        (log as UserUpdatedGroupRoleInCollection).properties.author_login
      }`,
      group: `**${
        (log as UserUpdatedGroupRoleInCollection).properties.group_name
      }**`,
      role1: `${
        (log as UserUpdatedGroupRoleInCollection).properties.old_permission
      }`,
      role2: `${
        (log as UserUpdatedGroupRoleInCollection).properties.permission
      }`,
      name: `**${
        (log as UserUpdatedGroupRoleInCollection).properties.collection_name
      }**`,
    }),
  [ActivityLogType.UserUpdatedUserRoleInCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_UPDATED_USER_ROLES, {
      user: `${
        (log as UserUpdatedUserRoleInCollection).properties.author_login
      }`,
      email: `**${
        (log as UserUpdatedUserRoleInCollection).properties.group_name
      }**`,
      role1: `${
        (log as UserUpdatedUserRoleInCollection).properties.old_permission
      }`,
      role2: `${
        (log as UserUpdatedUserRoleInCollection).properties.permission
      }`,
      name: `**${
        (log as UserUpdatedUserRoleInCollection).properties.collection_name
      }**`,
    }),
  [ActivityLogType.UserRevokedGroupFromCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_REVOKED_GROUPS, {
      user: `${
        (log as UserRevokedGroupFromCollection).properties.author_login
      }`,
      name: `**${
        (log as UserRevokedGroupFromCollection).properties.collection_name
      }**`,
      group: `**${
        (log as UserRevokedGroupFromCollection).properties.group_name
      }**`,
    }),
  [ActivityLogType.UserRevokedUserFromCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_SHARED_COLLECTION_REVOKED_USER, {
      user: `${(log as UserRevokedUserFromCollection).properties.author_login}`,
      name: `**${
        (log as UserRevokedUserFromCollection).properties.collection_name
      }**`,
      email: `**${
        (log as UserRevokedUserFromCollection).properties.target_login
      }**`,
    }),
  [ActivityLogType.UserRenamedSharedCollection]: (log, translate) =>
    translate(I18N_KEYS.USER_PRIVATE_COLLECTION_RENAMED, {
      user: `${(log as UserRenamedCollection).properties.author_login}`,
      old: `**${
        (log as UserRenamedCollection).properties.old_collection_name
      }**`,
      new: `**${(log as UserRenamedCollection).properties.collection_name}**`,
    }),
  [ActivityLogType.UserCreatedCredential]: (log, translate) =>
    translate(I18N_KEYS.USER_CREATED_CREDENTIAL, {
      domain: `**${(log as UserCreatedCredential).properties.domain_url}**`,
    }),
  [ActivityLogType.UserModifiedCredential]: (log, translate) =>
    translate(I18N_KEYS.USER_MODIFIED_CREDENTIAL, {
      domain: `**${(log as UserModifiedCredential).properties.domain_url}**`,
    }),
  [ActivityLogType.UserDeletedCredential]: (log, translate) =>
    translate(I18N_KEYS.USER_DELETED_CREDENTIAL, {
      domain: `**${(log as UserDeletedCredential).properties.domain_url}**`,
    }),
  [ActivityLogType.UserImportedCredentials]: (log, translate) => {
    const importCSVText =
      (log as UserImportedCredentials).properties.import_count > 1
        ? I18N_KEYS.USER_IMPORTED_CREDENTIALS.MANY
        : I18N_KEYS.USER_IMPORTED_CREDENTIALS.ONE;
    return translate(importCSVText, {
      importCount: `**${
        (log as UserImportedCredentials).properties.import_count
      }**`,
    });
  },
  [ActivityLogType.UserCreatedSecureNote]: (log, translate) =>
    translate(I18N_KEYS.USER_CREATED_SECURE_NOTE, {
      name: `**${(log as UserCreatedSecureNote).properties.item_name}**`,
    }),
  [ActivityLogType.UserModifiedSecureNote]: (log, translate) =>
    translate(I18N_KEYS.USER_MODIFIED_SECURE_NOTE, {
      name: `**${(log as UserModifiedSecureNote).properties.item_name}**`,
    }),
  [ActivityLogType.UserDeletedSecureNote]: (log, translate) =>
    translate(I18N_KEYS.USER_DELETED_SECURE_NOTE, {
      name: `**${(log as UserDeletedSecureNote).properties.item_name}**`,
    }),
  [ActivityLogType.NudgeExecuted]: (log, translate) => {
    const nudgeExecutedLog = log as NudgeExecuted;
    const translatedNudgeName = translateNudgeName(
      nudgeExecutedLog.properties.nudge_name,
      translate
    );
    return translate(
      nudgeExecutedLog.properties.failures > 0
        ? I18N_KEYS.NUDGE_EXECUTED_WITH_FAILURES
        : I18N_KEYS.NUDGE_EXECUTED,
      {
        nudge_name: `**${translatedNudgeName}**`,
        successes: `**${nudgeExecutedLog.properties.successes}**`,
        failures: `**${nudgeExecutedLog.properties.failures}**`,
      }
    );
  },
  [ActivityLogType.NudgeConfigured]: (log, translate) => {
    const nudgeConfiguredLog = log as NudgeConfigured;
    const translatedNudgeName = translateNudgeName(
      nudgeConfiguredLog.properties.nudge_name,
      translate
    );
    const translatedStatus = translateStatus(
      nudgeConfiguredLog.properties.status,
      translate
    );
    return translate(I18N_KEYS.NUDGE_CONFIGURED, {
      nudge_name: `**${translatedNudgeName}**`,
      status: `**${translatedStatus}**`,
    });
  },
  [ActivityLogType.NitroIntegrationAppInstalled]: (log, translate) =>
    translate(I18N_KEYS.NITRO_INTEGRATION_APP_INSTALLED, {
      integration_app: `**${
        (log as NitroIntegrationAppInstalled).properties.integration_app
      }**`,
    }),
  [ActivityLogType.NitroIntegrationAppUninstalled]: (log, translate) =>
    translate(I18N_KEYS.NITRO_INTEGRATION_APP_UNINSTALLED, {
      integration_app: `**${
        (log as NitroIntegrationAppUninstalled).properties.integration_app
      }**`,
    }),
  [ActivityLogType.UserReceivedNudge]: (log, translate) => {
    const userReceivedNudgeLog = log as UserReceivedNudge;
    const translatedNudgeReceived = translateNudgeName(
      userReceivedNudgeLog.properties.nudge_received,
      translate
    );
    return translate(I18N_KEYS.USER_RECEIVED_NUDGE, {
      nudge_received: `**${translatedNudgeReceived}**`,
    });
  },
  [ActivityLogType.MassDeploymentConfigurationUpdated]: (log, translate) => {
    const configurationUpdatedLog = log as MassDeploymentConfigurationUpdated;
    const translatedStatus = translateStatus(
      configurationUpdatedLog.properties.status,
      translate
    );
    return translate(I18N_KEYS.MASS_DEPLOYMENT_CONFIGURATION_UPDATED, {
      status: `**${translatedStatus}**`,
    });
  },
  [ActivityLogType.UserTypedCompromisedPassword]: (log, translate) =>
    translate(I18N_KEYS.USER_TYPED_COMPROMISED_PASSWORD, {
      domain_url: `**${
        (log as UserTypedWeakPassword).properties?.domain_url
      }**`,
    }),
  [ActivityLogType.UserTypedWeakPassword]: (log, translate) =>
    translate(I18N_KEYS.USER_TYPED_WEAK_PASSWORD, {
      domain_url: `**${
        (log as UserTypedWeakPassword).properties?.domain_url
      }**`,
    }),
  [ActivityLogType.UserTypedPassword]: (log, translate) => {
    const {
      properties: { domain_url, health_status },
    } = log as UserTypedPassword;
    return translate(
      health_status === "compromised"
        ? I18N_KEYS.USER_TYPED_COMPROMISED_PASSWORD
        : I18N_KEYS.USER_TYPED_WEAK_PASSWORD,
      {
        domain_url: `**${domain_url}**`,
      }
    );
  },
  [ActivityLogType.UserPerformedAutofillCredential]: (log, translate) => {
    const {
      properties: { credential_login, credential_domain, autofilled_domain },
    } = log as UserPerformedAutofillCredential;
    return translate(I18N_KEYS.USER_PERFORMED_AUTOFILL_CREDENTIAL, {
      credential_login: `**${credential_login}**`,
      credential_domain: `**${credential_domain}**`,
      autofilled_domain: `**${autofilled_domain}**`,
    });
  },
  [ActivityLogType.UserPerformedAutofillPayment]: (log, translate) => {
    const {
      properties: { item_name, item_type, autofilled_domain },
    } = log as UserPerformedAutofillPayment;
    const translationKey =
      item_type === "bank_account"
        ? I18N_KEYS.USER_PERFORMED_AUTOFILL_BANK_ACCOUNT
        : I18N_KEYS.USER_PERFORMED_AUTOFILL_PAYMENT_CARD;
    return translate(translationKey, {
      item_name: `**${item_name}**`,
      item_type: `**${item_type}**`,
      autofilled_domain: `**${autofilled_domain}**`,
    });
  },
  [ActivityLogType.UserAuthenticatedWithPasskey]: (log, translate) => {
    const {
      properties: { passkey_domain, current_domain, credential_login },
    } = log as UserAuthenticatedWithPasskey;
    return translate(I18N_KEYS.USER_AUTHENTICATED_WITH_PASSKEY, {
      credential_login: `**${credential_login}**`,
      passkey_domain: `**${passkey_domain}**`,
      current_domain: `**${current_domain}**`,
    });
  },
  [ActivityLogType.UserRevealedCredentialField]: (log, translate) => {
    const {
      properties: { credential_domain, credential_login, field },
    } = log as UserRevealedCredentialField;
    return translate(I18N_KEYS.USER_REVEALED_CREDENTIAL_FIELD, {
      field: `**${field}**`,
      credential_login: `**${credential_login}**`,
      credential_domain: `**${credential_domain}**`,
    });
  },
  [ActivityLogType.UserRevealedCreditCardField]: (log, translate) => {
    const {
      properties: { name, field },
    } = log as UserRevealedCreditCardField;
    return translate(I18N_KEYS.USER_REVEALED_CREDIT_CARD_FIELD, {
      field: `**${field}**`,
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserRevealedBankAccountField]: (log, translate) => {
    const {
      properties: { name, field },
    } = log as UserRevealedBankAccountField;
    return translate(I18N_KEYS.USER_REVEALED_BANK_ACCOUNT_FIELD, {
      field: `**${field}**`,
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserRevealedSecret]: (log, translate) => {
    const {
      properties: { name },
    } = log as UserRevealedSecret;
    return translate(I18N_KEYS.USER_REVEALED_SECRET_FIELD, {
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserRevealedSecureNote]: (log, translate) => {
    const {
      properties: { name },
    } = log as UserRevealedSecureNote;
    return translate(I18N_KEYS.USER_REVEALED_SECURE_NOTE_FIELD, {
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserCopiedCredentialField]: (log, translate) => {
    const {
      properties: { credential_domain, credential_login, field },
    } = log as UserCopiedCredentialField;
    return translate(I18N_KEYS.USER_COPIED_CREDENTIAL_FIELD, {
      field: `**${field}**`,
      credential_login: `**${credential_login}**`,
      credential_domain: `**${credential_domain}**`,
    });
  },
  [ActivityLogType.UserCopiedCreditCardField]: (log, translate) => {
    const {
      properties: { name, field },
    } = log as UserCopiedCreditCardField;
    return translate(I18N_KEYS.USER_COPIED_CREDIT_CARD_FIELD, {
      field: `**${field}**`,
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserCopiedBankAccountField]: (log, translate) => {
    const {
      properties: { name, field },
    } = log as UserCopiedBankAccountField;
    return translate(I18N_KEYS.USER_COPIED_BANK_ACCOUNT_FIELD, {
      field: `**${field}**`,
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserCopiedSecret]: (log, translate) => {
    const {
      properties: { name },
    } = log as UserCopiedSecret;
    return translate(I18N_KEYS.USER_COPIED_SECRET_FIELD, {
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserCopiedSecureNote]: (log, translate) => {
    const {
      properties: { name },
    } = log as UserCopiedSecureNote;
    return translate(I18N_KEYS.USER_COPIED_SECURE_NOTE_FIELD, {
      name: `**${name}**`,
    });
  },
  [ActivityLogType.UserIncludedItemInPasswordHealth]: (log, translate) => {
    const {
      properties: { credential_login, credential_domain },
    } = log as UserPasswordHealthExcludedItem;
    return translate(I18N_KEYS.USER_INCLUDED_ITEM_IN_PASSWORD_HEALTH, {
      credential_login: `**${credential_login}**`,
      credential_domain: `**${credential_domain}**`,
    });
  },
  [ActivityLogType.UserExcludedItemFromPasswordHealth]: (log, translate) => {
    const {
      properties: { credential_login, credential_domain },
    } = log as UserPasswordHealthIncludedItem;
    return translate(I18N_KEYS.USER_EXCLUDED_ITEM_FROM_PASSWORD_HEALTH, {
      credential_login: `**${credential_login}**`,
      credential_domain: `**${credential_domain}**`,
    });
  },
};
export const getAuditLogActivityDescription = (
  log: ActivityLog,
  translate: TranslatorInterface
): string => {
  if (!supportedTypes.includes(log.log_type as ActivityLogType)) {
    return "";
  }
  return logTranslation[log.log_type](log, translate);
};
