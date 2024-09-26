import { SavePIIdentityFromCapture, SavePIIdentityFromUI } from "../../../Save";
import { DataQuery } from "../../types";
export type IdentityFilterField = "spaceId";
export type IdentitySortField = "lastUse" | "id";
export type IdentityDataQuery = DataQuery<
  IdentitySortField,
  IdentityFilterField
>;
export type SavePIIdentity = SavePIIdentityFromCapture | SavePIIdentityFromUI;
