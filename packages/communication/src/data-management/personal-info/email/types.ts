import { SavePIEmailFromCapture, SavePIEmailFromUI } from "../../../Save";
import { DataQuery } from "../../types";
export type EmailFilterField = "spaceId";
export type EmailSortField = "lastUse" | "id";
export type EmailDataQuery = DataQuery<EmailSortField, EmailFilterField>;
export type SavePIEmail = SavePIEmailFromCapture | SavePIEmailFromUI;
