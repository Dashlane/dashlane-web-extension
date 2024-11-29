import { TranslatorInterface } from "../../../../libs/i18n/types";
import {
  ActivityLog,
  ActivityLogCategory,
} from "@dashlane/risk-monitoring-contracts";
import { IconProps } from "@dashlane/design-system";
export const supportedCategories = [
  ActivityLogCategory.Account,
  ActivityLogCategory.Authentication,
  ActivityLogCategory.DarkWebMonitoring,
  ActivityLogCategory.Groups,
  ActivityLogCategory.TeamSettings,
  ActivityLogCategory.TeamSettingsSSO,
  ActivityLogCategory.TeamSettingsSAMLProvisioning,
  ActivityLogCategory.TeamSettingsSCIM,
  ActivityLogCategory.TeamSettingsSIEM,
  ActivityLogCategory.Sharing,
  ActivityLogCategory.UserSettings,
  ActivityLogCategory.Users,
  ActivityLogCategory.VaultCollections,
  ActivityLogCategory.VaultPasswords,
  ActivityLogCategory.VaultSecureNotes,
  ActivityLogCategory.TeamNudges,
  ActivityLogCategory.RiskDetection,
  ActivityLogCategory.ItemUsage,
];
const I18N_KEYS = {
  CATEGORY_ACCOUNT: "team_audit_log_category_account",
  CATEGORY_AUTHENTICATION: "team_audit_log_category_authentication",
  CATEGORY_DARKWEBMONITORING: "team_audit_log_category_dark_web_monitoring",
  CATEGORY_GROUPS: "team_audit_log_category_groups",
  CATEGORY_SHARING: "team_audit_log_category_sharing",
  CATEGORY_TEAMSETTINGSSAMLPROVISIONING:
    "team_audit_log_category_team_settings_samlprovisioning",
  CATEGORY_TEAMSETTINGSSCIM: "team_audit_log_category_team_settings_scim",
  CATEGORY_TEAMSETTINGSSIEM: "team_audit_log_category_team_settings_siem",
  CATEGORY_TEAMSETTINGSSSO: "team_audit_log_category_team_settings_sso",
  CATEGORY_TEAMSETTINGS: "team_audit_log_category_team_settings",
  CATEGORY_USERS: "team_audit_log_category_users",
  CATEGORY_USERSETTINGS: "team_audit_log_category_user_settings",
  CATEGORY_VAULTCOLLECTIONS: "team_audit_log_category_vault_collections",
  CATEGORY_VAULTPASSWORDS: "team_audit_log_category_vault_passwords",
  CATEGORY_VAULTSECURENOTES: "team_audit_log_category_vault_securenotes",
  CATEGORY_TEAMNUDGES: "team_audit_log_category_team_nudges",
  CATEGORY_SECURITYMONITORING: "team_audit_log_category_security_monitoring",
  CATEGORY_AUTOFILL: "team_audit_log_category_item_usage",
};
const logCategoryViewMapper = (
  category: ActivityLogCategory
): [string, IconProps["name"]] => {
  switch (category) {
    case ActivityLogCategory.Account: {
      return [I18N_KEYS.CATEGORY_ACCOUNT, "AccountSettingsOutlined"];
    }
    case ActivityLogCategory.Authentication: {
      return [I18N_KEYS.CATEGORY_AUTHENTICATION, "ItemLoginOutlined"];
    }
    case ActivityLogCategory.DarkWebMonitoring: {
      return [
        I18N_KEYS.CATEGORY_DARKWEBMONITORING,
        "FeatureDarkWebMonitoringOutlined",
      ];
    }
    case ActivityLogCategory.Groups: {
      return [I18N_KEYS.CATEGORY_GROUPS, "GroupOutlined"];
    }
    case ActivityLogCategory.TeamSettings: {
      return [I18N_KEYS.CATEGORY_TEAMSETTINGS, "SettingsOutlined"];
    }
    case ActivityLogCategory.TeamSettingsSAMLProvisioning: {
      return [
        I18N_KEYS.CATEGORY_TEAMSETTINGSSAMLPROVISIONING,
        "SettingsOutlined",
      ];
    }
    case ActivityLogCategory.TeamSettingsSSO: {
      return [I18N_KEYS.CATEGORY_TEAMSETTINGSSSO, "SettingsOutlined"];
    }
    case ActivityLogCategory.TeamSettingsSCIM: {
      return [I18N_KEYS.CATEGORY_TEAMSETTINGSSCIM, "SettingsOutlined"];
    }
    case ActivityLogCategory.TeamSettingsSIEM: {
      return [I18N_KEYS.CATEGORY_TEAMSETTINGSSIEM, "SettingsOutlined"];
    }
    case ActivityLogCategory.Sharing: {
      return [I18N_KEYS.CATEGORY_SHARING, "SharedOutlined"];
    }
    case ActivityLogCategory.UserSettings: {
      return [I18N_KEYS.CATEGORY_USERSETTINGS, "SettingsOutlined"];
    }
    case ActivityLogCategory.Users: {
      return [I18N_KEYS.CATEGORY_USERS, "UsersOutlined"];
    }
    case ActivityLogCategory.VaultCollections: {
      return [I18N_KEYS.CATEGORY_VAULTCOLLECTIONS, "CollectionOutlined"];
    }
    case ActivityLogCategory.VaultPasswords: {
      return [I18N_KEYS.CATEGORY_VAULTPASSWORDS, "ItemLoginOutlined"];
    }
    case ActivityLogCategory.VaultSecureNotes: {
      return [I18N_KEYS.CATEGORY_VAULTSECURENOTES, "ItemSecureNoteOutlined"];
    }
    case ActivityLogCategory.TeamNudges: {
      return [I18N_KEYS.CATEGORY_TEAMNUDGES, "FeatureAutomationsOutlined"];
    }
    case ActivityLogCategory.RiskDetection: {
      return [I18N_KEYS.CATEGORY_SECURITYMONITORING, "ItemLoginOutlined"];
    }
    case ActivityLogCategory.ItemUsage: {
      return [I18N_KEYS.CATEGORY_AUTOFILL, "FeatureAutofillOutlined"];
    }
    default: {
      return ["", "SettingsOutlined"];
    }
  }
};
export const getAuditLogActivityCategory = (
  log: ActivityLog,
  translate: TranslatorInterface
): {
  label: string;
  icon: IconProps["name"];
} => {
  const [key, icon] = logCategoryViewMapper(
    log.category as ActivityLogCategory
  );
  return { label: key ? translate(key) : "", icon };
};
