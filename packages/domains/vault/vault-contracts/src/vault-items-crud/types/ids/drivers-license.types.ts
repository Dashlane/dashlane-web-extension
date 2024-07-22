import { BaseIdWithExpiration } from "./base-id.types";
export interface DriversLicense extends BaseIdWithExpiration {
  state: string;
}
