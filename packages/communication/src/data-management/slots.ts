import { combineEvents } from "ts-event-bus";
import {
  breachesCommandsSlots,
  breachesLiveQueriesSlots,
  breachesQueriesSlots,
} from "./breaches";
import { collectionsCommandsSlots } from "./collections";
import {
  credentialsCommandsSlots,
  credentialsLiveQueriesSlots,
  credentialsQueriesSlots,
} from "./credentials";
import { exportCommandsSlots, exportQueriesSlots } from "./export";
import {
  generatedPasswordsCommandsSlots,
  generatedPasswordsLiveQueriesSlots,
  generatedPasswordsQueriesSlots,
} from "./generated-passwords";
import { idsCommandsSlots } from "./ids";
import {
  importCommandsSlots,
  importLiveQueriesSlots,
  importQueriesSlots,
} from "./import";
import {
  passkeyCommandsSlots,
  passkeyLiveQueriesSlots,
  passkeyQueriesSlots,
} from "./passkeys";
import {
  passwordHistoryLiveQueriesSlots,
  passwordHistoryQueriesSlots,
} from "./password-history";
import {
  paymentCardCommandsSlots,
  paymentCardLiveQueriesSlots,
  paymentCardQueriesSlots,
} from "./payment-cards";
import {
  secureFilesCommandsSlots,
  secureFilesLiveQueriesSlots,
  secureFilesQueriesSlots,
} from "./secure-files";
import { noteLiveQueriesSlots, noteQueriesSlots } from "./secure-notes";
import {
  settingsCommandsSlots,
  settingsLiveQueriesSlots,
  settingsQueriesSlots,
} from "./settings";
import { spacesQueriesSlots } from "./spaces";
import { vaultCommandsSlots, vaultQueriesSlots } from "./vault";
import { secretLiveQueriesSlots } from "./secrets";
import { duplicationCommandsSlots } from "./duplication/duplication-slots";
export const dataManagementQueriesSlots = combineEvents(
  breachesQueriesSlots,
  credentialsQueriesSlots,
  exportQueriesSlots,
  generatedPasswordsQueriesSlots,
  importQueriesSlots,
  noteQueriesSlots,
  passkeyQueriesSlots,
  passwordHistoryQueriesSlots,
  paymentCardQueriesSlots,
  secureFilesQueriesSlots,
  settingsQueriesSlots,
  spacesQueriesSlots,
  vaultQueriesSlots
);
export const dataManagementLiveQueriesSlots = combineEvents(
  breachesLiveQueriesSlots,
  credentialsLiveQueriesSlots,
  generatedPasswordsLiveQueriesSlots,
  importLiveQueriesSlots,
  noteLiveQueriesSlots,
  passkeyLiveQueriesSlots,
  passwordHistoryLiveQueriesSlots,
  paymentCardLiveQueriesSlots,
  secretLiveQueriesSlots,
  secureFilesLiveQueriesSlots,
  settingsLiveQueriesSlots
);
export const dataManagementCommandsSlots = combineEvents(
  breachesCommandsSlots,
  collectionsCommandsSlots,
  credentialsCommandsSlots,
  exportCommandsSlots,
  generatedPasswordsCommandsSlots,
  idsCommandsSlots,
  importCommandsSlots,
  passkeyCommandsSlots,
  paymentCardCommandsSlots,
  secureFilesCommandsSlots,
  settingsCommandsSlots,
  vaultCommandsSlots,
  duplicationCommandsSlots
);
