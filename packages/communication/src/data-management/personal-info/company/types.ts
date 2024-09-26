import { SavePICompanyFromCapture, SavePICompanyFromUI } from "../../../Save";
import { DataQuery } from "../../types";
export type CompanyFilterField = "spaceId";
export type CompanySortField = "lastUse" | "id";
export type CompanyDataQuery = DataQuery<CompanySortField, CompanyFilterField>;
export type SavePICompany = SavePICompanyFromCapture | SavePICompanyFromUI;
