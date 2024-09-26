import { combineEvents } from "ts-event-bus";
import { abTestsLiveQueriesSlots } from "../../ABTesting";
import { contactInfoLiveQueriesSlots } from "../../Account/ContactInfo";
import { antiPhishingLiveQueriesSlots } from "../../AntiPhishing";
import { authenticationLiveQueriesSlots } from "../../Authentication";
import { dataManagementLiveQueriesSlots } from "../../data-management";
import { changeMasterPasswordLiveQueriesSlots } from "../../ChangeMasterPassword";
import { cryptoMigrationLiveQueriesSlots } from "../../CryptoMigration";
import { remoteFilesLiveQueriesSlots } from "../../File";
import { killswitchLiveQueriesSlots } from "../../Killswitch";
import { loginNotificationsLiveQueriesSlots } from "../../LoginNotifications";
import { loginStepInfoLiveQueriesSlots } from "../../LoginStepInfo";
import { notificationsLiveQueriesSlots } from "../../Notifications";
import { openSessionLiveQueriesSlots } from "../../OpenSession";
import { protectedItemsUnlockerLiveQueriesSlots } from "../../ProtectedItemsUnlocker";
import { recoveryLiveQueriesSlots } from "../../Recovery";
import { sharingLiveQueriesSlots } from "../../Sharing/2";
import { teamAdminLiveQueriesSlots } from "../../TeamAdmin";
import { userMessagesLiveQueriesSlots } from "../../UserMessages";
import { vpnLiveQueriesSlots } from "../../Vpn";
export const carbonLiveQueriesSlots = combineEvents(
  abTestsLiveQueriesSlots,
  antiPhishingLiveQueriesSlots,
  authenticationLiveQueriesSlots,
  changeMasterPasswordLiveQueriesSlots,
  contactInfoLiveQueriesSlots,
  cryptoMigrationLiveQueriesSlots,
  dataManagementLiveQueriesSlots,
  killswitchLiveQueriesSlots,
  loginNotificationsLiveQueriesSlots,
  loginStepInfoLiveQueriesSlots,
  notificationsLiveQueriesSlots,
  openSessionLiveQueriesSlots,
  protectedItemsUnlockerLiveQueriesSlots,
  recoveryLiveQueriesSlots,
  remoteFilesLiveQueriesSlots,
  sharingLiveQueriesSlots,
  teamAdminLiveQueriesSlots,
  userMessagesLiveQueriesSlots,
  vpnLiveQueriesSlots
);
export type CarbonLiveQueriesSlots = typeof carbonLiveQueriesSlots;
