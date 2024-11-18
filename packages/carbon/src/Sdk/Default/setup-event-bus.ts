import { CarbonServices, CoreServices, getCoreServices } from "Services/index";
import { EventBusService } from "EventBus";
import { setupSubscriptions as setupABTestsSubscriptions } from "ABTests/subscriptions";
import { setupSubscriptions as setupDataManagementSubscriptions } from "DataManagement";
import { setupSubscriptions as setupLoginSubscriptions } from "Login/subscriptions";
import { setupSubscriptions as setupSdkSubscriptions } from "Sdk/Default/subscriptions";
import { setupSubscriptions as setupSessionSubscriptions } from "Session";
import { setupSubscriptions as setupSharingSubscriptions } from "Sharing/2";
import { setupSubscriptions as setupTeamAdminSubscriptions } from "TeamAdmin";
import { setupSubscriptions as setupPasswordLeakSubscriptions } from "PasswordLeak/subscriptions";
import { setupSubscriptions as setupAccountRecoverySubscriptions } from "Recovery/subscriptions";
import { setupSubscriptions as setupKillswitchSubscriptions } from "Killswitch/subscriptions";
import { setupSubscriptions as setupAuthenticationSubscriptions } from "Authentication/subscriptions";
import { setupSubscriptions as setupCryptoSubscriptions } from "CryptoMigration/subscriptions";
import { setupUserSettingsLogSubscriptions } from "UserSettingsLog/subscriptions";
import { setupSubscriptions as setupRemoteFileUpdateSubscriptions } from "RemoteFileUpdates/subscriptions";
import { setupSubscriptions as setupAntiPhishingSubscriptions } from "AntiPhishing/subscriptions";
import { setupSubscriptions as setupSyncSubscriptions } from "User/Services/subscriptions";
type SubscriptionFn = (
  eventBus: EventBusService,
  services: CoreServices
) => void;
interface SubscriptionSetupHook {
  moduleName: string;
  subscriptionFn: SubscriptionFn;
}
function registerSubscriptionHook(
  moduleName: string,
  subscriptionFn: SubscriptionFn
) {
  return {
    moduleName,
    subscriptionFn,
  };
}
const SUBSCRIPTIONS: SubscriptionSetupHook[] = [
  registerSubscriptionHook("ABTests", setupABTestsSubscriptions),
  registerSubscriptionHook("Recovery", setupAccountRecoverySubscriptions),
  registerSubscriptionHook("Authentication", setupAuthenticationSubscriptions),
  registerSubscriptionHook("CryptoMigration", setupCryptoSubscriptions),
  registerSubscriptionHook("DataManagement", setupDataManagementSubscriptions),
  registerSubscriptionHook("Killswitch", setupKillswitchSubscriptions),
  registerSubscriptionHook("Login", setupLoginSubscriptions),
  registerSubscriptionHook("PasswordLeak", setupPasswordLeakSubscriptions),
  registerSubscriptionHook("Sdk", setupSdkSubscriptions),
  registerSubscriptionHook("Session", setupSessionSubscriptions),
  registerSubscriptionHook("TeamAdmin", setupTeamAdminSubscriptions),
  registerSubscriptionHook("Sharing", setupSharingSubscriptions),
  registerSubscriptionHook(
    "UserSettingsLog",
    setupUserSettingsLogSubscriptions
  ),
  registerSubscriptionHook(
    "RemoteFileUpdates",
    setupRemoteFileUpdateSubscriptions
  ),
  registerSubscriptionHook("AntiPhishing", setupAntiPhishingSubscriptions),
  registerSubscriptionHook("Sync", setupSyncSubscriptions),
];
export function setupEventBus(carbonServices: CarbonServices): EventBusService {
  const services = getCoreServices(carbonServices);
  const eventBus = services.eventBusService;
  console.log(`[background/carbon] Setting up eventBus subscriptions`);
  SUBSCRIPTIONS.forEach((subscriptionHook) => {
    try {
      subscriptionHook.subscriptionFn(eventBus, services);
    } catch (error) {
      console.error(
        `[background/carbon] Error while setting up eventBus subscriptions`,
        subscriptionHook.moduleName,
        error
      );
      throw error;
    }
  });
  console.log(`[background/carbon] Done setting up eventBus subscriptions`);
  return eventBus;
}
