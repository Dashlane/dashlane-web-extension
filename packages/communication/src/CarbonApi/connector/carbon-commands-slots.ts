import { combineEvents } from "ts-event-bus";
import { abTestsCommandsSlots } from "../../ABTesting";
import { contactInfoCommandsSlots } from "../../Account/ContactInfo";
import { authenticationCommandsSlots } from "../../Authentication";
import { changeMasterPasswordCommandsSlots } from "../../ChangeMasterPassword";
import { cryptoMigrationCommandsSlots } from "../../CryptoMigration";
import { darkWebInsightsCommandsSlots } from "../../DarkWebInsights";
import { dataManagementCommandsSlots } from "../../data-management";
import { familyCommandsSlots } from "../../Family";
import { remoteFileCommandsSlots } from "../../File";
import { globalExtensionSettingsCommandsSlots } from "../../GlobalExtensionSettings";
import { healthCommandsSlots } from "../../Health";
import { eventLoggerCommandsSlots } from "../../Logging/EventLogger";
import { exceptionCommandsSlots } from "../../Logging/Exception";
import { loginCommandsSlots } from "../../Login";
import { loginNotificationsCommandsSlots } from "../../LoginNotifications";
import { loginStepInfoCommandsSlots } from "../../LoginStepInfo";
import { notificationsCommandsSlots } from "../../Notifications";
import { openSessionCommandsSlots } from "../../OpenSession";
import { passwordGeneratorCommandsSlots } from "../../PasswordGenerator";
import { paymentsCommandsSlots } from "../../Payments";
import { protectedItemsUnlockerCommandsSlots } from "../../ProtectedItemsUnlocker";
import { recoveryCommandsSlots } from "../../Recovery";
import { sharingCommandsSlots } from "../../Sharing/2";
import { teamCommandsSlots } from "../../Team";
import { teamAdminCommandsSlots } from "../../TeamAdmin";
import { userMessagesCommandsSlots } from "../../UserMessages";
import { vpnCommandsSlots } from "../../Vpn";
import { deviceCommandsSlots } from "../../Device";
export const carbonCommandsSlots = combineEvents(
  abTestsCommandsSlots,
  authenticationCommandsSlots,
  changeMasterPasswordCommandsSlots,
  contactInfoCommandsSlots,
  cryptoMigrationCommandsSlots,
  darkWebInsightsCommandsSlots,
  dataManagementCommandsSlots,
  eventLoggerCommandsSlots,
  exceptionCommandsSlots,
  familyCommandsSlots,
  globalExtensionSettingsCommandsSlots,
  healthCommandsSlots,
  loginCommandsSlots,
  loginNotificationsCommandsSlots,
  loginStepInfoCommandsSlots,
  notificationsCommandsSlots,
  openSessionCommandsSlots,
  passwordGeneratorCommandsSlots,
  paymentsCommandsSlots,
  protectedItemsUnlockerCommandsSlots,
  recoveryCommandsSlots,
  remoteFileCommandsSlots,
  sharingCommandsSlots,
  teamCommandsSlots,
  teamAdminCommandsSlots,
  userMessagesCommandsSlots,
  vpnCommandsSlots,
  deviceCommandsSlots
);
export type CarbonCommandsSlots = typeof carbonCommandsSlots;
