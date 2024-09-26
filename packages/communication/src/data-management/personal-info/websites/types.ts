import {
  SavePIPersonalWebsiteFromCapture,
  SavePIPersonalWebsiteFromUI,
} from "../../../Save";
import { DataQuery } from "../../types";
export type PersonalWebsiteFilterField = "spaceId";
export type PersonalWebsiteSortField = "lastUse" | "id";
export type PersonalWebsiteDataQuery = DataQuery<
  PersonalWebsiteSortField,
  PersonalWebsiteFilterField
>;
export type SavePIPersonalWebsite =
  | SavePIPersonalWebsiteFromCapture
  | SavePIPersonalWebsiteFromUI;
