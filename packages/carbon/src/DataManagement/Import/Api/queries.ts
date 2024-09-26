import { ImportPersonalDataState } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type ImportPersonalDataQueries = {
  getImportPersonalDataStatus: Query<void, ImportPersonalDataState>;
};
