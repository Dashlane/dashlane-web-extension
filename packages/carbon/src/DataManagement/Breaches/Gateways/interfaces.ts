import {
  GetLatestPrivateBreachesResult,
  GetLatestPublicBreachesResult,
} from "DataManagement/Breaches/Gateways/types";
export interface BreachesGateway {
  getLatestPublicBreaches: (
    sinceRevision: number
  ) => Promise<GetLatestPublicBreachesResult>;
  getLatestPrivateBreaches: (
    sinceDate: number
  ) => Promise<GetLatestPrivateBreachesResult | null>;
}
