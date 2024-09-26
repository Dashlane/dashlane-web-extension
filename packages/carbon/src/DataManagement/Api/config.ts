import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { config as breachesCommandQueryBusConfig } from "DataManagement/Breaches/Api/config";
import { config as collectionsCommandQueryBusConfig } from "DataManagement/Collections/Api/config";
import { config as credentialCommandQueryBusConfig } from "DataManagement/Credentials/Api/config";
import { config as driverLicensesCommandQueryBusConfig } from "DataManagement/Ids/DriverLicenses/Api/config";
import { config as fiscalIdCommandQueryBusConfig } from "DataManagement/Ids/FiscalIds/Api/config";
import { config as idCardCommandQueryBusConfig } from "DataManagement/Ids/IdCards/Api/config";
import { config as passkeyCommandQueryBusConfig } from "DataManagement/Passkeys/Api/config";
import { config as passportCommandQueryBusConfig } from "DataManagement/Ids/Passports/Api/config";
import { config as passwordHistoryCommandQueryBusConfig } from "DataManagement/PasswordHistory/Api/config";
import { config as paymentCardsCommandQueryBusConfig } from "DataManagement/PaymentCards/Api/config";
import { config as socialSecurityIdCommandQueryBusConfig } from "DataManagement/Ids/SocialSecurityIds/Api/config";
import { config as exportCommandsQueryBusConfig } from "DataManagement/Export/Api/config";
import { config as noteCommandQueryBusConfig } from "DataManagement/SecureNotes/Api/config";
import { config as generatedPasswordCommandQueryBusConfig } from "DataManagement/GeneratedPassword/Api/config";
import { config as secureFilesConfig } from "DataManagement/SecureFiles/Api/config";
import { config as settingsConfig } from "DataManagement/Settings/Api/config";
import { config as spaceConfig } from "DataManagement/Spaces/Api/config";
import { config as noteCategoryCommandQueryBusConfig } from "DataManagement/SecureNoteCategory/Api/config";
import { config as duplicationCommandQueryBusConfig } from "DataManagement/Duplication/Api/config";
import { DataManagementQueries } from "DataManagement/Api/queries";
import { DataManagementLiveQueries } from "DataManagement/Api/live-queries";
import { DataManagementCommands } from "DataManagement/Api/commands";
import { importApiConfig } from "DataManagement/Import/Api/config";
import { vaultConfig } from "DataManagement/Vault/Api/config";
export const config: CommandQueryBusConfig<
  DataManagementCommands,
  DataManagementQueries,
  DataManagementLiveQueries
> = {
  commands: {
    ...vaultConfig.commands,
    ...breachesCommandQueryBusConfig.commands,
    ...collectionsCommandQueryBusConfig.commands,
    ...credentialCommandQueryBusConfig.commands,
    ...driverLicensesCommandQueryBusConfig.commands,
    ...exportCommandsQueryBusConfig.commands,
    ...fiscalIdCommandQueryBusConfig.commands,
    ...generatedPasswordCommandQueryBusConfig.commands,
    ...idCardCommandQueryBusConfig.commands,
    ...importApiConfig.commands,
    ...noteCommandQueryBusConfig.commands,
    ...passkeyCommandQueryBusConfig.commands,
    ...passportCommandQueryBusConfig.commands,
    ...passwordHistoryCommandQueryBusConfig.commands,
    ...paymentCardsCommandQueryBusConfig.commands,
    ...secureFilesConfig.commands,
    ...noteCategoryCommandQueryBusConfig.commands,
    ...settingsConfig.commands,
    ...socialSecurityIdCommandQueryBusConfig.commands,
    ...duplicationCommandQueryBusConfig.commands,
  },
  queries: {
    ...vaultConfig.queries,
    ...breachesCommandQueryBusConfig.queries,
    ...credentialCommandQueryBusConfig.queries,
    ...exportCommandsQueryBusConfig.queries,
    ...generatedPasswordCommandQueryBusConfig.queries,
    ...importApiConfig.queries,
    ...noteCommandQueryBusConfig.queries,
    ...passkeyCommandQueryBusConfig.queries,
    ...passwordHistoryCommandQueryBusConfig.queries,
    ...paymentCardsCommandQueryBusConfig.queries,
    ...secureFilesConfig.queries,
    ...settingsConfig.queries,
    ...spaceConfig.queries,
  },
  liveQueries: {
    ...breachesCommandQueryBusConfig.liveQueries,
    ...credentialCommandQueryBusConfig.liveQueries,
    ...generatedPasswordCommandQueryBusConfig.liveQueries,
    ...importApiConfig.liveQueries,
    ...noteCommandQueryBusConfig.liveQueries,
    ...passkeyCommandQueryBusConfig.liveQueries,
    ...passwordHistoryCommandQueryBusConfig.liveQueries,
    ...paymentCardsCommandQueryBusConfig.liveQueries,
    ...secureFilesConfig.liveQueries,
    ...settingsConfig.liveQueries,
  },
};
