import {
  Banks,
  GetBanksRequest,
  GetBanksResult,
} from "@dashlane/communication";
import { banks } from "StaticData/Banks/data";
export function getBanks(request: GetBanksRequest): GetBanksResult {
  return {
    banks: banks[request.country],
  };
}
export function getAllBanks(): Banks {
  return banks;
}
