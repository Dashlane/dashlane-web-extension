import { ImportPersonalDataState } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type ImportPersonalDataLives = {
  liveImportPersonalDataStatus: LiveQuery<void, ImportPersonalDataState>;
};
