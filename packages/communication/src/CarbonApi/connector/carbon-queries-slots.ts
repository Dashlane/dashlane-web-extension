import { combineEvents } from "ts-event-bus";
import { abTestsQueriesSlots } from "../../ABTesting";
import { contactInfoQueriesSlots } from "../../Account/ContactInfo";
import { authenticationQueriesSlots } from "../../Authentication";
import { autofillDataQueriesSlots } from "../../AutofillData";
import { dataManagementQueriesSlots } from "../../data-management";
import { cryptoMigrationQueriesSlots } from "../../CryptoMigration";
import { deviceQueriesSlots } from "../../Device";
import { featureQueriesSlots } from "../../Feature";
import { remoteFilesQueriesSlots } from "../../File";
import { killswitchQueriesSlots } from "../../Killswitch";
import { loginNotificationsQueriesSlots } from "../../LoginNotifications";
import { loginStepInfoQueriesSlots } from "../../LoginStepInfo";
import { notificationsQueriesSlots } from "../../Notifications";
import { openSessionQueriesSlots } from "../../OpenSession";
import { passwordGeneratorQueriesSlots } from "../../PasswordGenerator";
import { paymentsQueriesSlots } from "../../Payments";
import { protectedItemsUnlockerQueriesSlots } from "../../ProtectedItemsUnlocker";
import { recoveryQueriesSlots } from "../../Recovery";
import { staticDataQueriesSlots } from "../../StaticData";
import { sharingQueriesSlots } from "../../Sharing/2";
import { teamQueriesSlots } from "../../Team";
import { teamAdminQueriesSlots } from "../../TeamAdmin";
import { userMessagesQueriesSlots } from "../../UserMessages";
import { vpnQueriesSlots } from "../../Vpn";
export const carbonQueriesSlots = combineEvents(
  abTestsQueriesSlots,
  authenticationQueriesSlots,
  autofillDataQueriesSlots,
  contactInfoQueriesSlots,
  cryptoMigrationQueriesSlots,
  dataManagementQueriesSlots,
  deviceQueriesSlots,
  featureQueriesSlots,
  killswitchQueriesSlots,
  loginNotificationsQueriesSlots,
  loginStepInfoQueriesSlots,
  notificationsQueriesSlots,
  openSessionQueriesSlots,
  passwordGeneratorQueriesSlots,
  paymentsQueriesSlots,
  protectedItemsUnlockerQueriesSlots,
  recoveryQueriesSlots,
  remoteFilesQueriesSlots,
  sharingQueriesSlots,
  staticDataQueriesSlots,
  teamQueriesSlots,
  teamAdminQueriesSlots,
  userMessagesQueriesSlots,
  vpnQueriesSlots
);
export type CarbonQueriesSlots = typeof carbonQueriesSlots;
