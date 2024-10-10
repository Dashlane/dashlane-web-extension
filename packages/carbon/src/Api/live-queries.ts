import { LiveQueries as ABTestsLiveQueries } from "ABTests";
import { LiveQueries as AntiPhishingLiveQueries } from "AntiPhishing";
import { LiveQueries as ChangeMasterPasswordLiveQueries } from "ChangeMasterPassword";
import { LiveQueries as ContactInfoLiveQueries } from "Account/ContactInfo";
import { LiveQueries as CryptoMigrationLiveQueries } from "CryptoMigration";
import { LiveQueries as DataManagementLiveQueries } from "DataManagement";
import { LiveQueries as KillswitchLiveQueries } from "Killswitch";
import { LiveQueries as LoginLiveQueries } from "Login";
import { LiveQueries as LoginNotificationsLiveQueries } from "LoginNotifications";
import { LiveQueries as LoginStepInfoLiveQueries } from "LoginStepInfo";
import { LiveQueries as NotificationsLiveQueries } from "Notifications";
import { LiveQueries as RecoveryLiveQueries } from "Recovery";
import { LiveQueries as ProtectedItemsUnlockerLiveQueries } from "ProtectedItemsUnlocker";
import { LiveQueries as SessionLiveQueries } from "Session";
import { LiveQueries as SharingLiveQueries } from "Sharing/2";
import { LiveQueries as TeamAdminLiveQueries } from "TeamAdmin";
import { LiveQueries as UserMessagesLiveQueries } from "UserMessages";
import { VpnLives } from "VPN/Api/lives";
import { LiveQueries as RemoteFileLiveQueries } from "RemoteFileUpdates";
import { AuthenticationLiveQueries } from "Authentication/Api/live-queries";
export type CarbonLiveQueries = ABTestsLiveQueries &
  AntiPhishingLiveQueries &
  AuthenticationLiveQueries &
  ChangeMasterPasswordLiveQueries &
  ContactInfoLiveQueries &
  CryptoMigrationLiveQueries &
  DataManagementLiveQueries &
  KillswitchLiveQueries &
  LoginLiveQueries &
  LoginNotificationsLiveQueries &
  LoginStepInfoLiveQueries &
  NotificationsLiveQueries &
  ProtectedItemsUnlockerLiveQueries &
  RecoveryLiveQueries &
  SessionLiveQueries &
  SharingLiveQueries &
  TeamAdminLiveQueries &
  UserMessagesLiveQueries &
  VpnLives &
  RemoteFileLiveQueries;
