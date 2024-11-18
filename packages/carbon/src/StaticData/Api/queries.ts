import {
  Banks,
  GetBanksRequest,
  GetBanksResult,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type StaticDataQueries = {
  getAllBanks: Query<void, Banks>;
  getBanks: Query<GetBanksRequest, GetBanksResult>;
  getSecureDocumentsExtensionsList: Query<void, string[]>;
};
