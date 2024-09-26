import { SavePIPhoneFromCapture, SavePIPhoneFromUI } from "../../../Save";
import { DataQuery } from "../../types";
export type PhoneFilterField = "spaceId";
export type PhoneSortField = "lastUse" | "id";
export type PhoneDataQuery = DataQuery<PhoneSortField, PhoneFilterField>;
export type SavePIPhone = SavePIPhoneFromCapture | SavePIPhoneFromUI;
