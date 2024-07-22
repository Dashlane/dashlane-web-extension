import { Country } from "./country.types";
export interface BaseItem {
  kwType?: string;
  creationDatetime?: number;
  id: string;
  lastBackupTime: number;
  lastUse?: number;
  localeFormat: Country;
  spaceId: string;
  userModificationDatetime?: number;
}
