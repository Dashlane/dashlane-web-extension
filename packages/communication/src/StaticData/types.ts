import { Country } from "../";
export interface BankData {
  localizedString: string;
  code: string;
}
export type Banks = Partial<Record<Country, BankData[]>>;
export interface GetBanksRequest {
  country: Country;
}
export interface GetBanksResult {
  banks: BankData[];
}
export type CallingCodes = Partial<Record<Country, number>>;
