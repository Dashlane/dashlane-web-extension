import { BreachLiveQueries } from "DataManagement/Breaches/Api/live-queries";
import { CredentialLiveQueries } from "DataManagement/Credentials/Api/live-queries";
import { SettingsLiveQueries } from "DataManagement/Settings/Api/live-queries";
import { NoteLiveQueries } from "DataManagement/SecureNotes/Api/live-queries";
import { PasskeyLiveQueries } from "DataManagement/Passkeys/Api/live-queries";
import { PasswordHistoryLiveQueries } from "DataManagement/PasswordHistory/Api/live-queries";
import { PaymentCardLiveQueries } from "DataManagement/PaymentCards/Api/live-queries";
import { GeneratedPasswordsLiveQueries } from "DataManagement/GeneratedPassword/Api/live-queries";
import { ImportPersonalDataLives } from "DataManagement/Import/Api/lives";
import { SecureFileLiveQueries } from "DataManagement/SecureFiles/Api/live-queries";
export type DataManagementLiveQueries = BreachLiveQueries &
  CredentialLiveQueries &
  GeneratedPasswordsLiveQueries &
  ImportPersonalDataLives &
  NoteLiveQueries &
  PasskeyLiveQueries &
  PasswordHistoryLiveQueries &
  PaymentCardLiveQueries &
  SettingsLiveQueries &
  SecureFileLiveQueries;
