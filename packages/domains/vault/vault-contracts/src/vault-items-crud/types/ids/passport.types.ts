import { BaseIdWithExpiration } from "./base-id.types";
export interface Passport extends BaseIdWithExpiration {
  issuePlace: string;
}
