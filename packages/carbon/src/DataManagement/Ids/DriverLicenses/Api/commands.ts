import {
  AddDriverLicenseRequest,
  AddDriverLicenseResult,
  EditDriverLicenseRequest,
  EditDriverLicenseResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type DriverLicenseCommands = {
  addDriverLicense: Command<AddDriverLicenseRequest, AddDriverLicenseResult>;
  editDriverLicense: Command<EditDriverLicenseRequest, EditDriverLicenseResult>;
};
