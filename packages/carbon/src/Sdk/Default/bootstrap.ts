import { CarbonServices, getCoreServices } from "Services";
import { CommandQueryBus } from "Shared/Infrastructure";
import { Infrastructure } from "init-options";
import { bootstrap as bootstrapABTests } from "ABTests";
import { bootstrap as bootstrapContactInfo } from "Account/ContactInfo";
import { bootstrap as bootstrapAuthentication } from "Authentication";
import { bootstrap as bootstrapAutofillData } from "Autofill/VaultData";
import { bootstrap as bootstrapChangeMP } from "ChangeMasterPassword";
import { bootstrap as bootstrapCryptoMigration } from "CryptoMigration";
import { bootstrap as bootstrapDataManagement } from "DataManagement";
import { bootstrap as bootstrapDevice } from "Device";
import { bootstrap as bootstrapEventLogger } from "Logs/EventLogger";
import { bootstrap as bootstrapException } from "Logs/Exception";
import { bootstrap as bootstrapFamily } from "Family";
import { bootstrap as bootstrapFeature } from "Feature";
import { bootstrap as bootstrapGlobalExtensionSettings } from "GlobalExtensionSettings";
import { bootstrap as bootstrapHealth } from "Health";
import { bootstrap as bootstrapLogin } from "Login";
import { bootstrap as bootstrapLoginStepInfo } from "LoginStepInfo";
import { bootstrap as bootstrapKillswitch } from "Killswitch";
import { bootstrap as bootstrapLoginNotifications } from "LoginNotifications";
import { bootstrap as bootstrapNotifications } from "Notifications";
import { bootstrap as bootstrapPasswordGenerator } from "PasswordGenerator/bootstrap";
import { bootstrap as bootstrapProtectedItemsUnlocker } from "ProtectedItemsUnlocker";
import { bootstrap as bootstrapRecovery } from "Recovery";
import { bootstrap as bootstrapDarkWebInsights } from "DarkWebInsights";
import { bootstrap as bootstrapSession } from "Session";
import { bootstrap as bootstrapSharing } from "Sharing/2";
import { bootstrap as bootstrapStaticData } from "StaticData";
import { bootstrap as bootstrapTeam } from "Team";
import { bootstrap as bootstrapTeamAdmin } from "TeamAdmin";
import { bootstrap as bootstrapPayments } from "Payments";
import { bootstrap as bootstrapUserMessages } from "UserMessages";
import { vpnApiBootstrap } from "VPN/bootstrap";
import { bootstrap as bootstrapRemoteFileUpdate } from "RemoteFileUpdates";
import { bootstrap as bootstrapAntiPhishing } from "AntiPhishing";
const MODULES_BOOTSTRAPS = [
  bootstrapGlobalExtensionSettings,
  bootstrapABTests,
  bootstrapAuthentication,
  bootstrapAutofillData,
  bootstrapChangeMP,
  bootstrapCryptoMigration,
  bootstrapDataManagement,
  bootstrapDevice,
  bootstrapEventLogger,
  bootstrapException,
  bootstrapContactInfo,
  bootstrapFamily,
  bootstrapFeature,
  bootstrapHealth,
  bootstrapKillswitch,
  bootstrapLogin,
  bootstrapLoginNotifications,
  bootstrapNotifications,
  bootstrapProtectedItemsUnlocker,
  bootstrapRecovery,
  bootstrapDarkWebInsights,
  bootstrapSession,
  bootstrapSharing,
  bootstrapStaticData,
  bootstrapTeam,
  bootstrapTeamAdmin,
  bootstrapPasswordGenerator,
  vpnApiBootstrap,
  bootstrapPayments,
  bootstrapUserMessages,
  bootstrapLoginStepInfo,
  bootstrapRemoteFileUpdate,
  bootstrapAntiPhishing,
];
export const bootstrap = (
  carbonServices: CarbonServices,
  commandQueryBus: CommandQueryBus,
  infrastructure?: Infrastructure
) => {
  console.log(`[background/carbon] Running bootstrap hooks...`);
  const services = getCoreServices(carbonServices);
  for (let i = 0; i < MODULES_BOOTSTRAPS.length; ++i) {
    try {
      const bootstrapFn = MODULES_BOOTSTRAPS[i];
      bootstrapFn(commandQueryBus, services, infrastructure);
    } catch (error) {
      console.error(
        `[background/carbon] Failed running bootstrap hook ${i + 1}/${
          MODULES_BOOTSTRAPS.length
        }`,
        error
      );
      throw error;
    }
  }
  console.log(`[background/carbon] Done running bootstrap hooks`);
};
