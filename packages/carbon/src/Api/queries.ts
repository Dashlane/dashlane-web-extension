import { Queries as ABTestsQueries } from "ABTests";
import { Queries as AuthenticationQueries } from "Authentication";
import { Queries as AutofillDataQueries } from "Autofill/VaultData";
import { Queries as ContactInfoQueries } from "Account/ContactInfo";
import { Queries as CryptoMigrationQueries } from "CryptoMigration";
import { Queries as DataManagementQueries } from "DataManagement";
import { Queries as FeatureQueries } from "Feature";
import { Queries as KillswitchQueries } from "Killswitch";
import { Queries as LoginQueries } from "Login";
import { Queries as LoginNotificationsQueries } from "LoginNotifications";
import { Queries as LoginStepInfoQueries } from "LoginStepInfo";
import { Queries as PaymentsQueries } from "Payments";
import { Queries as ProtectecItemsUnlockerQueries } from "ProtectedItemsUnlocker";
import { Queries as RecoveryQueries } from "Recovery";
import { Queries as SessionQueries } from "Session";
import { Queries as SharingQueries } from "Sharing/2";
import { Queries as StaticDataQueries } from "StaticData";
import { Queries as TeamQueries } from "Team";
import { Queries as TeamAdminQueries } from "TeamAdmin";
import { Queries as NotificationsQueries } from "Notifications";
import { Queries as UserMessagesQueries } from "UserMessages";
import { VpnQueries } from "VPN/Api/queries";
import { DeviceQueries } from "Device/Api/queries";
import { Queries as RemoteFileQueries } from "RemoteFileUpdates";
import { PasswordGeneratorQueries } from "PasswordGenerator/Api/queries";
export type CarbonQueries = ABTestsQueries &
  AuthenticationQueries &
  AutofillDataQueries &
  ContactInfoQueries &
  CryptoMigrationQueries &
  DataManagementQueries &
  DeviceQueries &
  FeatureQueries &
  KillswitchQueries &
  LoginQueries &
  LoginNotificationsQueries &
  LoginStepInfoQueries &
  NotificationsQueries &
  PasswordGeneratorQueries &
  PaymentsQueries &
  ProtectecItemsUnlockerQueries &
  RecoveryQueries &
  SessionQueries &
  SharingQueries &
  StaticDataQueries &
  TeamQueries &
  TeamAdminQueries &
  UserMessagesQueries &
  VpnQueries &
  RemoteFileQueries;
