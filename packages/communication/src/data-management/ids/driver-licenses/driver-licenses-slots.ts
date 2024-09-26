import { slot } from "ts-event-bus";
import {
  AddDriverLicenseRequest,
  AddDriverLicenseResult,
  EditDriverLicenseRequest,
  EditDriverLicenseResult,
} from "./types";
export const driverLicensesCommandsSlots = {
  addDriverLicense: slot<AddDriverLicenseRequest, AddDriverLicenseResult>(),
  editDriverLicense: slot<EditDriverLicenseRequest, EditDriverLicenseResult>(),
};
