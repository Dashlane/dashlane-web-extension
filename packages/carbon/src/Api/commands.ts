import { Commands as ABTestsCommands } from "ABTests";
import { Commands as AuthenticationCommands } from "Authentication";
import { Commands as ContactInfoCommands } from "Account/ContactInfo";
import { Commands as ChangeMasterPasswordCommands } from "ChangeMasterPassword";
import { Commands as CryptoMigrationCommands } from "CryptoMigration";
import { Commands as ExportCommands } from "DataManagement/Export";
import { Commands as FamilyCommands } from "Family";
import { Commands as GlobalExtensionSettingsCommands } from "GlobalExtensionSettings";
import { Commands as HealthCommands } from "Health";
import { Commands as LoginCommands } from "Login";
import { Commands as LoginNotificationsCommands } from "LoginNotifications";
import { Commands as NotificationsCommands } from "Notifications";
import { Commands as ProtectedItemsUnlockerCommands } from "ProtectedItemsUnlocker";
import { Commands as RecoveryCommands } from "Recovery";
import { Commands as DarkWebInsightsCommands } from "DarkWebInsights";
import { Commands as TeamCommands } from "Team";
import { Commands as TeamAdminCommands } from "TeamAdmin";
import { DataManagementCommands } from "DataManagement/Api/commands";
import { PasswordGeneratorCommands } from "PasswordGenerator/Api/commands";
import { SessionCommands } from "Session/Api/commands";
import { EventLoggerCommands } from "Logs/EventLogger/Api/commands";
import { ExceptionCommands } from "Logs/Exception/Api/commands";
import { VpnCommands } from "VPN/Api/commands";
import { PaymentsCommands } from "Payments/Api/commands";
import { UserMessagesCommands } from "UserMessages/Api/commands";
import { LoginStepInfoCommands } from "LoginStepInfo/Api/commands";
import { SharingCommands } from "Sharing/2/Api/commands";
import { RemoteFileCommands } from "RemoteFileUpdates";
export type CarbonCommands = ABTestsCommands &
  AuthenticationCommands &
  ContactInfoCommands &
  ChangeMasterPasswordCommands &
  CryptoMigrationCommands &
  DataManagementCommands &
  ExportCommands &
  FamilyCommands &
  GlobalExtensionSettingsCommands &
  HealthCommands &
  LoginCommands &
  LoginStepInfoCommands &
  LoginNotificationsCommands &
  NotificationsCommands &
  ProtectedItemsUnlockerCommands &
  RecoveryCommands &
  DarkWebInsightsCommands &
  SessionCommands &
  TeamCommands &
  TeamAdminCommands &
  PasswordGeneratorCommands &
  UserMessagesCommands &
  EventLoggerCommands &
  ExceptionCommands &
  VpnCommands &
  PaymentsCommands &
  PaymentsCommands &
  SharingCommands &
  RemoteFileCommands;
