import { userVerificationApi } from "@dashlane/authentication-contracts";
import {
  autofillDataApi,
  autofillSecurityApi,
  autofillSettingsApi,
  autofillTrackingApi,
  linkedWebsitesApi,
} from "@dashlane/autofill-contracts";
import { featureFlipsApi } from "@dashlane/framework-contracts";
import {
  otpApi,
  passwordHealthApi,
} from "@dashlane/password-security-contracts";
import {
  passwordLimitApi,
  vaultItemsCrudApi,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { subscriptionCodeApi } from "@dashlane/account-contracts";
import {
  activityLogsApi,
  loggedOutMonitoringApi,
} from "@dashlane/risk-monitoring-contracts";
export type AutofillEngineApplicationDependencies = {
  readonly autofillData: typeof autofillDataApi;
  readonly autofillSecurity: typeof autofillSecurityApi;
  readonly autofillSettings: typeof autofillSettingsApi;
  readonly autofillTracking: typeof autofillTrackingApi;
  readonly featureFlips: typeof featureFlipsApi;
  readonly linkedWebsites: typeof linkedWebsitesApi;
  readonly otp: typeof otpApi;
  readonly passwordHealth: typeof passwordHealthApi;
  readonly passwordLimit: typeof passwordLimitApi;
  readonly userVerification: typeof userVerificationApi;
  readonly vaultItemsCrud: typeof vaultItemsCrudApi;
  readonly loggedOutMonitoring: typeof loggedOutMonitoringApi;
  readonly vaultOrganization: typeof vaultOrganizationApi;
  readonly sharingCollections: typeof sharingCollectionsApi;
  readonly subscriptionCode: typeof subscriptionCodeApi;
  readonly activityLogs: typeof activityLogsApi;
};
