import { BreachQueries } from "DataManagement/Breaches/Api/queries";
import { CredentialQueries } from "DataManagement/Credentials/Api/queries";
import { NoteQueries } from "DataManagement/SecureNotes/Api/queries";
import { PasskeyQueries } from "DataManagement/Passkeys/Api/queries";
import { PasswordHistoryQueries } from "DataManagement/PasswordHistory/Api/queries";
import { PaymentCardQueries } from "DataManagement/PaymentCards/Api/queries";
import { SettingsQueries } from "DataManagement/Settings/Api/queries";
import { GeneratedPasswordQueries } from "DataManagement/GeneratedPassword/Api/queries";
import { SpaceQueries } from "DataManagement/Spaces/Api/queries";
import { ExportQueries } from "DataManagement/Export/Api/queries";
import { ImportPersonalDataQueries } from "DataManagement/Import/Api/queries";
import { SecureFileInfoQueries } from "DataManagement/SecureFiles/Api/queries";
import { VaultQueries } from "DataManagement/Vault/Api/queries";
export type DataManagementQueries = VaultQueries &
  BreachQueries &
  CredentialQueries &
  ExportQueries &
  GeneratedPasswordQueries &
  ImportPersonalDataQueries &
  NoteQueries &
  PasskeyQueries &
  PasswordHistoryQueries &
  PaymentCardQueries &
  SecureFileInfoQueries &
  SettingsQueries &
  SpaceQueries;
