import { SavePIAddressFromCapture, SavePIAddressFromUI } from "../../../Save";
import { DataQuery } from "../../types";
export type AddressFilterField = "spaceId";
export type AddressSortField = "lastUse" | "id";
export type AddressDataQuery = DataQuery<AddressSortField, AddressFilterField>;
export type SavePIAddress = SavePIAddressFromCapture | SavePIAddressFromUI;
