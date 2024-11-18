import { makeWSAuthentication, WSAuthentication } from "Libs/WS/Authentication";
import { makeWSContactInfo, WSContactInfo } from "Libs/WS/ContactInfo";
import { makeWSCountry, WSCountry } from "Libs/WS/Country";
import { makeWSDataLeaks, WSDataLeaks } from "Libs/WS/DataLeaks";
import { makeWSDevices, WSDevices } from "Libs/WS/Devices";
import { makeWSPremium, WSPremium } from "Libs/WS/Premium";
import { makeWSRecovery, WSRecovery } from "Libs/WS/Recovery/Recovery";
import { makeWSStrongAuth, WSStrongAuth } from "Libs/WS/StrongAuth";
import { makeWSTeamPlans, WSTeamPlans } from "Libs/WS/TeamPlans";
import { makeWSUserAlias, WSUserAlias } from "Libs/WS/UserAlias";
import { makeWSSettings, WSSettings } from "Libs/WS/Settings";
import {
  makeItemGroupWS,
  WSItemGroup,
} from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { _redacted_, WSQA } from "Libs/WS/QA";
import { makeSharingWS, WSSharing } from "Libs/WS/Sharing/2/GetSharing";
import { WSBackup } from "Libs/WS/Backup/types";
import { makeWSBackup } from "Libs/WS/Backup/WSBackup";
import { makeWSBreaches, WSBreaches } from "Libs/WS/Breaches";
import {
  makeUserGroupWS,
  WSUserGroup,
} from "Libs/WS/Sharing/2/PerformUserGroupAction";
import { makeWSUserActivity, WSUserActivity } from "Libs/WS/UserActivity";
import { makeWSIconCrawler, WSIconCrawler } from "Libs/WS/IconCrawler";
import { makeWSSecureFile, WSSecureFile } from "Libs/WS/SecureFile";
export interface WSService {
  authentication: WSAuthentication;
  backup: WSBackup;
  breaches: WSBreaches;
  contactInfo: WSContactInfo;
  country: WSCountry;
  dataleaks: WSDataLeaks;
  devices: WSDevices;
  iconCrawler: WSIconCrawler;
  itemGroup: WSItemGroup;
  premium: WSPremium;
  qa: WSQA;
  recovery: WSRecovery;
  settings: WSSettings;
  strongAuth: WSStrongAuth;
  teamPlans: WSTeamPlans;
  userAlias: WSUserAlias;
  sharing: WSSharing;
  userGroup: WSUserGroup;
  userActivity: WSUserActivity;
  secureFile: WSSecureFile;
}
