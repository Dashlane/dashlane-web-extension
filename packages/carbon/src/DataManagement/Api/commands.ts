import type { BreachCommands } from "DataManagement/Breaches/Api/commands";
import type { CollectionCommands } from "DataManagement/Collections/Api/commands";
import type { CredentialCommands } from "DataManagement/Credentials/Api/commands";
import type { DriverLicenseCommands } from "DataManagement/Ids/DriverLicenses/Api/commands";
import type { FiscalIdCommands } from "DataManagement/Ids/FiscalIds/Api/commands";
import type { GeneratedPasswordCommands } from "DataManagement/GeneratedPassword/Api/commands";
import type { IdCardCommands } from "DataManagement/Ids/IdCards/Api/commands";
import type { PasskeyCommands } from "DataManagement/Passkeys/Api/commands";
import type { PassportCommands } from "DataManagement/Ids/Passports/Api/commands";
import type { PaymentCardCommands } from "DataManagement/PaymentCards/Api/commands";
import type { SocialSecurityIdCommands } from "DataManagement/Ids/SocialSecurityIds/Api/commands";
import type { ExportCommands } from "DataManagement/Export/Api/commands";
import type { SettingsCommands } from "DataManagement/Settings/Api/commands";
import type { ImportPersonalDataCommands } from "DataManagement/Import/Api/commands";
import type { SecureFilesCommands } from "DataManagement/SecureFiles/Api/commands";
import type { VaultCommands } from "DataManagement/Vault/Api/commands";
export type DataManagementCommands = VaultCommands &
  BreachCommands &
  CollectionCommands &
  CredentialCommands &
  DriverLicenseCommands &
  ExportCommands &
  FiscalIdCommands &
  GeneratedPasswordCommands &
  IdCardCommands &
  ImportPersonalDataCommands &
  PasskeyCommands &
  PassportCommands &
  PaymentCardCommands &
  SecureFilesCommands &
  SettingsCommands &
  SocialSecurityIdCommands;
