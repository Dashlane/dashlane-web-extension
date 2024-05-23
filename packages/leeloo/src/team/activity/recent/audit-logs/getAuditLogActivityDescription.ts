import { fromUnixTime } from 'date-fns';
import { LocaleFormat } from 'libs/i18n/helpers';
import { TranslatorInterface } from 'libs/i18n/types';
import { ActivityLog, ActivityLogType, AlertReceivedForEmail, BiometricSignInDisabled, ContactEmailChanged, DomainRequested, DomainValidated, EmailAdded, EmailRemoved, MasterPasswordMobileReset, MasterPasswordMobileResetDisabled, MasterPasswordMobileResetEnabled, NewBillingPeriodCreated, NitroSsoDomainProvisioned, NitroSsoDomainRemoved, NitroSsoDomainVerified, SeatsAdded, TeamNameChanged, UserAcceptedSharingInviteCredential, UserAcceptedSharingInviteSecureNote, UserCreatedCredential, UserCreatedSecureNote, UserDeclinedInviteToUserGroup, UserDeletedCredential, UserDeletedSecureNote, UserDeviceAdded, UserDeviceLogin, UserDeviceRemoved, UserGroupCreated, UserGroupDeleted, UserGroupRenamed, UserImportedCredentials, UserInvitedToUserGroup, UserJoinedUserGroup, UserLeftUserGroup, UserModifiedCredential, UserModifiedSecureNote, UserRejectedSharingInviteCredential, UserRejectedSharingInviteSecureNote, UserRemovedFromUserGroup, UserRevokedSharedCredentialEmail, UserRevokedSharedCredentialExternal, UserRevokedSharedCredentialGroup, UserRevokedSharedSecureNoteEmail, UserRevokedSharedSecureNoteExternal, UserRevokedSharedSecureNoteGroup, UserSharedCredentialWithEmail, UserSharedCredentialWithExternal, UserSharedCredentialWithGroup, UserSharedSecureNoteWithEmail, UserSharedSecureNoteWithExternal, UserSharedSecureNoteWithGroup, } from '@dashlane/risk-monitoring-contracts';
type TranslatorFunction = (log: ActivityLog, translate: TranslatorInterface) => string;
const supportedTypes = Object.values(ActivityLogType);
const I18N_KEYS = {
    USER_INVITED: 'team_audit_log_user_invited',
    USER_REINVITED: 'team_audit_log_user_reinvited',
    USER_REMOVED: 'team_audit_log_user_removed',
    TEAM_CAPTAIN_ADDED: 'team_audit_log_team_captain_added',
    TEAM_CAPTAIN_REMOVED: 'team_audit_log_team_captain_removed',
    GROUP_MANAGER_ADDED: 'team_audit_log_group_manager_added',
    GROUP_MANAGER_REMOVED: 'team_audit_log_group_manager_removed',
    MASTER_PASSWORD_RESET_ACCEPTED: 'team_audit_log_master_password_reset_accepted',
    MASTER_PASSWORD_RESET_REFUSED: 'team_audit_log_master_password_reset_refused',
    BILLING_ADMIN_ADDED: 'team_audit_log_billing_admin_added',
    BILLING_ADMIN_REMOVED: 'team_audit_log_billing_admin_removed',
    USER_GROUP_CREATED: 'team_audit_log_user_group_created',
    USER_GROUP_RENAMED: 'team_audit_log_user_group_renamed',
    USER_GROUP_DELETED: 'team_audit_log_user_group_deleted',
    USER_JOINED_USER_GROUP: 'team_audit_log_user_joined_user_group',
    USER_LEFT_USER_GROUP: 'team_audit_log_user_left_user_group',
    USER_INVITED_TO_USER_GROUP: 'team_audit_log_user_invited_to_user_group',
    USER_DECLINED_INVITE_TO_USER_GROUP: 'team_audit_log_user_declined_invite_to_user_group',
    USER_REMOVED_FROM_USER_GROUP: 'team_audit_log_user_removed_from_user_group',
    SSO_IDP_METADATA_SET: 'team_audit_log_sso_idp_metadata_set',
    SSO_SERVICE_PROVIDER_URL_SET: 'team_audit_log_sso_service_provider_url_set',
    SSO_ENABLED: 'team_audit_log_sso_enabled',
    SSO_DISABLED: 'team_audit_log_sso_disabled',
    DOMAIN_REQUESTED: 'team_audit_log_domain_requested',
    DOMAIN_VALIDATED: 'team_audit_log_domain_validated',
    SENSITIVE_LOGS_ENABLED: 'team_audit_log_collect_sensitive_data_audit_logs_enabled',
    SENSITIVE_LOGS_DISABLED: 'team_audit_log_collect_sensitive_data_audit_logs_disabled',
    TEAM_NAME_CHANGED: 'team_audit_log_team_name_changed',
    NEW_BILLING_PERIOD_CREATED: 'team_audit_log_new_billing_period_created',
    SEATS_ADDED: 'team_audit_log_seats_added',
    CONTACT_EMAIL_CHANGED: 'team_audit_log_contact_email_changed',
    MASTER_PASSWORD_MOBILE_RESET_ENABLED: 'team_audit_log_master_password_mobile_reset_enabled',
    MASTER_PASSWORD_MOBILE_RESET_DISABLED: 'team_audit_log_master_password_mobile_reset_disabled',
    MASTER_PASSWORD_MOBILE_RESET: 'team_audit_log_master_password_mobile_reset',
    MASTER_PASSWORD_CHANGED: 'team_audit_log_master_password_changed',
    MP_TO_VIEW_PASSWORDS_ENABLED: 'team_audit_log_mp_to_view_passwords_enabled',
    MP_TO_VIEW_PASSWORDS_DISABLED: 'team_audit_log_mp_to_view_passwords_disabled',
    TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_ADDED: 'team_audit_log_two_factor_authentication_login_method_added',
    TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_REMOVED: 'team_audit_log_two_factor_authentication_login_method_removed',
    BIOMETRIC_SIGN_IN_DISABLED: 'team_audit_log_biometric_sign_in_disabled',
    NITRO_SSO_DOMAIN_PROVISIONED: 'team_audit_log_nitro_sso_domain_provisioned',
    NITRO_SSO_DOMAIN_REMOVED: 'team_audit_log_nitro_sso_domain_removed',
    NITRO_SSO_DOMAIN_VERIFIED: 'team_audit_log_nitro_sso_domain_verified',
    NITRO_SSO_SETUP_STARTED: 'team_audit_log_nitro_sso_setup_started',
    DWM_EMAIL_ADDED: 'team_audit_log_dwm_email_added',
    DWM_EMAIL_REMOVED: 'team_audit_log_dwm_email_removed',
    DWM_ALERT_RECEIVED: 'team_audit_log_dwm_alert_received',
    USER_DEVICE_ADDED: 'team_audit_log_user_device_added',
    USER_DEVICE_REMOVED: 'team_audit_log_user_device_removed',
    USER_DEVICE_LOGIN: 'team_audit_log_user_device_login',
    MASTER_PASSWORD_RESET: 'team_audit_log_master_password_reset',
    REQUESTED_ACCOUNT_RECOVERY: 'team_audit_log_requested_account_recovery',
    COMPLETED_ACCOUT_RECOVERY: 'team_audit_log_completed_account_recovery',
    USER_SHARED_CREDENTIAL_WITH_GROUP_FULL_RIGHTS: 'team_audit_log_user_shared_credential_with_group_full',
    USER_SHARED_CREDENTIAL_WITH_EMAIL_FULL_RIGHTS: 'team_audit_log_user_shared_credential_with_email_full',
    USER_SHARED_CREDENTIAL_WITH_EXTERNAL_FULL_RIGHTS: 'team_audit_log_user_shared_credential_with_external_full',
    USER_SHARED_CREDENTIAL_WITH_GROUP_LIMITED_RIGHTS: 'team_audit_log_user_shared_credential_with_group_limited',
    USER_SHARED_CREDENTIAL_WITH_EMAIL_LIMITED_RIGHTS: 'team_audit_log_user_shared_credential_with_email_limited',
    USER_SHARED_CREDENTIAL_WITH_EXTERNAL_LIMITED_RIGHTS: 'team_audit_log_user_shared_credential_with_external_limited',
    USER_SHARED_SECURE_NOTE_WITH_GROUP_FULL_RIGHTS: 'team_audit_log_user_shared_secure_note_with_group_full',
    USER_SHARED_SECURE_NOTE_WITH_EMAIL_FULL_RIGHTS: 'team_audit_log_user_shared_secure_note_with_email_full',
    USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_FULL_RIGHTS: 'team_audit_log_user_shared_secure_note_with_external_full',
    USER_SHARED_SECURE_NOTE_WITH_GROUP_LIMITED_RIGHTS: 'team_audit_log_user_shared_secure_note_with_group_limited',
    USER_SHARED_SECURE_NOTE_WITH_EMAIL_LIMITED_RIGHTS: 'team_audit_log_user_shared_secure_note_with_email_limited',
    USER_SHARED_SECURE_NOTE_WITH_EXTERNAL_LIMITED_RIGHTS: 'team_audit_log_user_shared_secure_note_with_external_limited',
    USER_ACCEPTED_SHARING_INVITE_SECURE_NOTE: 'team_audit_log_user_accepted_sharing_invite_secure_note',
    USER_REJECTED_SHARING_INVITE_SECURE_NOTE: 'team_audit_log_user_rejected_sharing_invite_secure_note',
    USER_ACCEPTED_SHARING_INVITE_CREDENTIAL: 'team_audit_log_user_accepted_sharing_invite_credential',
    USER_REJECTED_SHARING_INVITE_CREDENTIAL: 'team_audit_log_user_rejected_sharing_invite_credential',
    USER_REVOKED_SHARED_CREDENTIAL_GROUP: 'team_audit_log_user_revoked_shared_credential_group',
    USER_REVOKED_SHARED_CREDENTIAL_EMAIL: 'team_audit_log_user_revoked_shared_credential_email',
    USER_REVOKED_SHARED_CREDENTIAL_EXTERNAL: 'team_audit_log_user_revoked_shared_credential_external',
    USER_REVOKED_SHARED_SECURE_NOTE_GROUP: 'team_audit_log_user_revoked_shared_secure_note_group',
    USER_REVOKED_SHARED_SECURE_NOTE_EMAIL: 'team_audit_log_user_revoked_shared_secure_note_email',
    USER_REVOKED_SHARED_SECURE_NOTE_EXTERNAL: 'team_audit_log_user_revoked_shared_secure_note_external',
    USER_CREATED_CREDENTIAL: 'team_audit_log_user_created_credential',
    USER_MODIFIED_CREDENTIAL: 'team_audit_log_user_modified_credential',
    USER_DELETED_CREDENTIAL: 'team_audit_log_user_deleted_credential',
    USER_IMPORTED_CREDENTIALS: {
        ONE: 'team_audit_log_user_imported_credentials_one',
        MANY: 'team_audit_log_user_imported_credentials_many'
    },
    USER_CREATED_SECURE_NOTE: 'team_audit_log_user_created_secure_note',
    USER_MODIFIED_SECURE_NOTE: 'team_audit_log_user_modified_secure_note',
    USER_DELETED_SECURE_NOTE: 'team_audit_log_user_deleted_secure_note',
};
const logTranslation: Record<ActivityLogType, TranslatorFunction> = {
    [ActivityLogType.UserInvited]: (log, translate) => translate(I18N_KEYS.USER_INVITED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.UserReinvited]: (log, translate) => translate(I18N_KEYS.USER_REINVITED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.UserRemoved]: (log, translate) => translate(I18N_KEYS.USER_REMOVED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.TeamCaptainAdded]: (log, translate) => translate(I18N_KEYS.TEAM_CAPTAIN_ADDED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.TeamCaptainRemoved]: (log, translate) => translate(I18N_KEYS.TEAM_CAPTAIN_REMOVED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.GroupManagerAdded]: (log, translate) => translate(I18N_KEYS.GROUP_MANAGER_ADDED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.GroupManagerRemoved]: (log, translate) => translate(I18N_KEYS.GROUP_MANAGER_REMOVED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.MasterPasswordResetAccepted]: (log, translate) => translate(I18N_KEYS.MASTER_PASSWORD_RESET_ACCEPTED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.MasterPasswordResetRefused]: (log, translate) => translate(I18N_KEYS.MASTER_PASSWORD_RESET_REFUSED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.BillingAdminAdded]: (log, translate) => translate(I18N_KEYS.BILLING_ADMIN_ADDED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.BillingAdminRemoved]: (log, translate) => translate(I18N_KEYS.BILLING_ADMIN_REMOVED, {
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.UserGroupCreated]: (log, translate) => translate(I18N_KEYS.USER_GROUP_CREATED, {
        groupName: `**${(log as UserGroupCreated).properties?.group_name}**`,
    }),
    [ActivityLogType.UserGroupRenamed]: (log, translate) => translate(I18N_KEYS.USER_GROUP_RENAMED, {
        newGroupName: `**${(log as UserGroupCreated).properties?.group_name}**`,
        oldGroupName: `**${(log as UserGroupRenamed).properties?.old_group_name}**`,
    }),
    [ActivityLogType.UserGroupDeleted]: (log, translate) => translate(I18N_KEYS.USER_GROUP_DELETED, {
        groupName: `**${(log as UserGroupDeleted).properties?.group_name}**`,
    }),
    [ActivityLogType.UserJoinedUserGroup]: (log, translate) => translate(I18N_KEYS.USER_JOINED_USER_GROUP, {
        groupName: `**${(log as UserJoinedUserGroup).properties?.group_name}**`,
    }),
    [ActivityLogType.UserLeftUserGroup]: (log, translate) => translate(I18N_KEYS.USER_LEFT_USER_GROUP, {
        groupName: `**${(log as UserLeftUserGroup).properties?.group_name}**`,
    }),
    [ActivityLogType.UserInvitedToUserGroup]: (log, translate) => translate(I18N_KEYS.USER_INVITED_TO_USER_GROUP, {
        groupName: `**${(log as UserInvitedToUserGroup).properties?.group_name}**`,
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.UserDeclinedInviteToUserGroup]: (log, translate) => translate(I18N_KEYS.USER_DECLINED_INVITE_TO_USER_GROUP, {
        groupName: `**${(log as UserDeclinedInviteToUserGroup).properties?.group_name}**`,
    }),
    [ActivityLogType.UserRemovedFromUserGroup]: (log, translate) => translate(I18N_KEYS.USER_REMOVED_FROM_USER_GROUP, {
        groupName: `**${(log as UserRemovedFromUserGroup).properties?.group_name}**`,
        email: `**${log?.properties?.target_login}**`,
    }),
    [ActivityLogType.DomainRequested]: (log, translate) => translate(I18N_KEYS.DOMAIN_REQUESTED, {
        domain: `**${(log as DomainRequested).properties?.domain_url}**`,
    }),
    [ActivityLogType.DomainValidated]: (log, translate) => translate(I18N_KEYS.DOMAIN_VALIDATED, {
        domain: `**${(log as DomainValidated).properties?.domain_url}**`,
    }),
    [ActivityLogType.SensitiveLogsEnabled]: (_, translate) => translate(I18N_KEYS.SENSITIVE_LOGS_ENABLED),
    [ActivityLogType.SensitiveLogsDisabled]: (_, translate) => translate(I18N_KEYS.SENSITIVE_LOGS_DISABLED),
    [ActivityLogType.SsoIdpMetadataSet]: (_, translate) => translate(I18N_KEYS.SSO_IDP_METADATA_SET),
    [ActivityLogType.SsoServiceProviderUrlSet]: (_, translate) => translate(I18N_KEYS.SSO_SERVICE_PROVIDER_URL_SET),
    [ActivityLogType.SsoEnabled]: (_, translate) => translate(I18N_KEYS.SSO_ENABLED),
    [ActivityLogType.SsoDisabled]: (_, translate) => translate(I18N_KEYS.SSO_DISABLED),
    [ActivityLogType.TeamNameChanged]: (log, translate) => translate(I18N_KEYS.TEAM_NAME_CHANGED, {
        name: `**${(log as TeamNameChanged).properties?.name}**`,
    }),
    [ActivityLogType.NewBillingPeriodCreated]: (log, translate) => translate(I18N_KEYS.NEW_BILLING_PERIOD_CREATED, {
        date: `**${translate.shortDate(fromUnixTime((log as NewBillingPeriodCreated).properties?.new_end_date_unix), LocaleFormat.L)}**`,
    }),
    [ActivityLogType.SeatsAdded]: (log, translate) => translate(I18N_KEYS.SEATS_ADDED, {
        count: `**${(log as SeatsAdded).properties?.seats_added}**`,
    }),
    [ActivityLogType.ContactEmailChanged]: (log, translate) => translate(I18N_KEYS.CONTACT_EMAIL_CHANGED, {
        email: `**${(log as ContactEmailChanged)?.properties?.new_contact_email}**`,
    }),
    [ActivityLogType.MasterPasswordMobileResetEnabled]: (log, translate) => translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET_ENABLED, {
        deviceName: (log as MasterPasswordMobileResetEnabled)?.properties
            ?.device_name
            ? `**${(log as MasterPasswordMobileResetEnabled)?.properties?.device_name}**`
            : 'mobile',
    }),
    [ActivityLogType.MasterPasswordMobileResetDisabled]: (log, translate) => translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET_DISABLED, {
        deviceName: (log as MasterPasswordMobileResetDisabled)?.properties
            ?.device_name
            ? `**${(log as MasterPasswordMobileResetDisabled)?.properties?.device_name}**`
            : 'mobile',
    }),
    [ActivityLogType.MasterPasswordChanged]: (_, translate) => translate(I18N_KEYS.MASTER_PASSWORD_CHANGED),
    [ActivityLogType.MpToViewPasswordsEnabled]: (_, translate) => translate(I18N_KEYS.MP_TO_VIEW_PASSWORDS_ENABLED),
    [ActivityLogType.MpToViewPasswordsDisabled]: (_, translate) => translate(I18N_KEYS.MP_TO_VIEW_PASSWORDS_DISABLED),
    [ActivityLogType.TwoFactorAuthenticationLoginMethodAdded]: (_, translate) => translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_ADDED),
    [ActivityLogType.TwoFactorAuthenticationLoginMethodRemoved]: (_, translate) => translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_LOGIN_METHOD_REMOVED),
    [ActivityLogType.BiometricSignInDisabled]: (log, translate) => translate(I18N_KEYS.BIOMETRIC_SIGN_IN_DISABLED, {
        deviceName: `**${(log as BiometricSignInDisabled)?.properties?.device_name}**`,
    }),
    [ActivityLogType.NitroSsoSetupStarted]: (log, translate) => translate(I18N_KEYS.NITRO_SSO_SETUP_STARTED),
    [ActivityLogType.NitroSsoDomainProvisioned]: (log, translate) => translate(I18N_KEYS.NITRO_SSO_DOMAIN_PROVISIONED, {
        domain: `**${(log as NitroSsoDomainProvisioned)?.properties?.domain_url}**`,
    }),
    [ActivityLogType.NitroSsoDomainRemoved]: (log, translate) => translate(I18N_KEYS.NITRO_SSO_DOMAIN_REMOVED, {
        domain: `**${(log as NitroSsoDomainRemoved)?.properties?.domain_url}**`,
    }),
    [ActivityLogType.NitroSsoDomainVerified]: (log, translate) => translate(I18N_KEYS.NITRO_SSO_DOMAIN_VERIFIED, {
        domain: `**${(log as NitroSsoDomainVerified)?.properties?.domain_url}**`,
    }),
    [ActivityLogType.DWMEmailAdded]: (log, translate) => translate(I18N_KEYS.DWM_EMAIL_ADDED, {
        email: `**${(log as EmailAdded)?.properties?.dark_web_monitoring_email}**`,
    }),
    [ActivityLogType.DWMEmailRemoved]: (log, translate) => translate(I18N_KEYS.DWM_EMAIL_REMOVED, {
        email: `**${(log as EmailRemoved)?.properties?.dark_web_monitoring_email}**`,
    }),
    [ActivityLogType.DWMAlertReceived]: (log, translate) => translate(I18N_KEYS.DWM_ALERT_RECEIVED, {
        email: `**${(log as AlertReceivedForEmail)?.properties?.dark_web_monitoring_email}**`,
    }),
    [ActivityLogType.UserDeviceAdded]: (log, translate) => translate(I18N_KEYS.USER_DEVICE_ADDED, {
        name: `**${(log as UserDeviceAdded).properties?.device_name}**`,
    }),
    [ActivityLogType.UserDeviceRemoved]: (log, translate) => translate(I18N_KEYS.USER_DEVICE_REMOVED, {
        name: `**${(log as UserDeviceRemoved).properties?.device_name}**`,
    }),
    [ActivityLogType.UserDeviceLogin]: (log, translate) => translate(I18N_KEYS.USER_DEVICE_LOGIN, {
        name: `**${(log as UserDeviceLogin).properties?.device_name}**`,
    }),
    [ActivityLogType.MasterPasswordReset]: (_, translate) => translate(I18N_KEYS.MASTER_PASSWORD_RESET),
    [ActivityLogType.RequestedAccountRecovery]: (_, translate) => translate(I18N_KEYS.REQUESTED_ACCOUNT_RECOVERY),
    [ActivityLogType.CompletedAccountRecovery]: (_, translate) => translate(I18N_KEYS.COMPLETED_ACCOUT_RECOVERY),
    [ActivityLogType.MasterPasswordMobileReset]: (log, translate) => translate(I18N_KEYS.MASTER_PASSWORD_MOBILE_RESET, {
        deviceName: (log as MasterPasswordMobileReset)?.properties?.device_name
            ? `**${(log as MasterPasswordMobileReset)?.properties?.device_name}**`
            : 'mobile',
    }),
    [ActivityLogType.UserSharedCredentialWithGroup]: (log, translate) => {
        const activityLog = log as UserSharedCredentialWithGroup;
        const translationKey = activityLog.properties.permission === 'admin'
            ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_GROUP_FULL_RIGHTS
            : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_GROUP_LIMITED_RIGHTS;
        return translate(translationKey, {
            domain: `**${activityLog.properties.domain_url}**`,
            group: `**${activityLog.properties.group_name}**`,
        });
    },
    [ActivityLogType.UserSharedCredentialWithEmail]: (log, translate) => {
        const activityLog = log as UserSharedCredentialWithEmail;
        const translationKey = activityLog.properties.permission === 'admin'
            ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EMAIL_FULL_RIGHTS
            : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EMAIL_LIMITED_RIGHTS;
        return translate(translationKey, {
            domain: `**${activityLog.properties.domain_url}**`,
            email: `**${activityLog.properties.target_login}**`,
        });
    },
    [ActivityLogType.UserSharedCredentialWithExternal]: (log, translate) => {
        const activityLog = log as UserSharedCredentialWithExternal;
        const translationKey = activityLog.properties.permission === 'admin'
            ? I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EXTERNAL_FULL_RIGHTS
            : I18N_KEYS.USER_SHARED_CREDENTIAL_WITH_EXTERNAL_LIMITED_RIGHTS;
        return translate(translationKey, {
            domain: `**${activityLog.properties.domain_url}**`,
            email: `**${activityLog.properties.target_login}**`,
        });
    },
    [ActivityLogType.UserSharedSecureNoteWithGroup]: (log, translate) => {
        const activityLog = log as UserSharedSecureNoteWithGroup;
        const translationKey = activityLog.properties.permission === 'admin'
            ? I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_GROUP_FULL_RIGHTS
            : I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_GROUP_LIMITED_RIGHTS;
        return translate(translationKey, {
            name: `**${activityLog.properties.item_name}**`,
            group: `**${activityLog.properties.group_name}**`,
        });
    },
    [ActivityLogType.UserSharedSecureNoteWithEmail]: (log, translate) => {
        const activityLog = log as UserSharedSecureNoteWithEmail;
        const translationKey = activityLog.properties.permission === 'admin'
            ? I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EMAIL_FULL_RIGHTS
            : I18N_KEYS.USER_SHARED_SECURE_NOTE_WITH_EMAIL_LIMITED_RIGHTS;
        return translate(translationKey, {
            name: `**${activityLog.properties.item_name}**`,
            email: `**${activityLog.properties.target_login}**`,
        });
    },
    [ActivityLogType.UserSharedSecureNoteWithExternal]: (log, translate) => {
        const activityLog = log as UserSharedSecureNoteWithExternal;
        const translationKey = activityLog.properties.permission === 'admin'
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
    [ActivityLogType.UserAcceptedSharingInviteSecureNote]: (log, translate) => translate(I18N_KEYS.USER_ACCEPTED_SHARING_INVITE_SECURE_NOTE, {
        name: `**${(log as UserAcceptedSharingInviteSecureNote).properties.item_name}**`,
    }),
    [ActivityLogType.UserRejectedSharingInviteSecureNote]: (log, translate) => translate(I18N_KEYS.USER_REJECTED_SHARING_INVITE_SECURE_NOTE, {
        name: `**${(log as UserRejectedSharingInviteSecureNote).properties.item_name}**`,
    }),
    [ActivityLogType.UserAcceptedSharingInviteCredential]: (log, translate) => translate(I18N_KEYS.USER_ACCEPTED_SHARING_INVITE_CREDENTIAL, {
        domain: `**${(log as UserAcceptedSharingInviteCredential).properties.domain_url}**`,
    }),
    [ActivityLogType.UserRejectedSharingInviteCredential]: (log, translate) => translate(I18N_KEYS.USER_REJECTED_SHARING_INVITE_CREDENTIAL, {
        domain: `**${(log as UserRejectedSharingInviteCredential).properties.domain_url}**`,
    }),
    [ActivityLogType.UserCreatedCredential]: (log, translate) => translate(I18N_KEYS.USER_CREATED_CREDENTIAL, {
        domain: `**${(log as UserCreatedCredential).properties.domain_url}**`,
    }),
    [ActivityLogType.UserModifiedCredential]: (log, translate) => translate(I18N_KEYS.USER_MODIFIED_CREDENTIAL, {
        domain: `**${(log as UserModifiedCredential).properties.domain_url}**`,
    }),
    [ActivityLogType.UserDeletedCredential]: (log, translate) => translate(I18N_KEYS.USER_DELETED_CREDENTIAL, {
        domain: `**${(log as UserDeletedCredential).properties.domain_url}**`,
    }),
    [ActivityLogType.UserImportedCredentials]: (log, translate) => {
        const importCSVText = (log as UserImportedCredentials).properties.import_count > 1
            ? I18N_KEYS.USER_IMPORTED_CREDENTIALS.MANY
            : I18N_KEYS.USER_IMPORTED_CREDENTIALS.ONE;
        return translate(importCSVText, {
            importCount: `**${(log as UserImportedCredentials).properties.import_count}**`,
        });
    },
    [ActivityLogType.UserCreatedSecureNote]: (log, translate) => translate(I18N_KEYS.USER_CREATED_SECURE_NOTE, {
        name: `**${(log as UserCreatedSecureNote).properties.item_name}**`,
    }),
    [ActivityLogType.UserModifiedSecureNote]: (log, translate) => translate(I18N_KEYS.USER_MODIFIED_SECURE_NOTE, {
        name: `**${(log as UserModifiedSecureNote).properties.item_name}**`,
    }),
    [ActivityLogType.UserDeletedSecureNote]: (log, translate) => translate(I18N_KEYS.USER_DELETED_SECURE_NOTE, {
        name: `**${(log as UserDeletedSecureNote).properties.item_name}**`,
    }),
};
export const getAuditLogActivityDescription = (log: ActivityLog, translate: TranslatorInterface): string => {
    if (!supportedTypes.includes(log.log_type as ActivityLogType)) {
        return '';
    }
    return logTranslation[log.log_type](log, translate);
};
