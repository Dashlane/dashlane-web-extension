import { PersonalSettings } from "../../DataModel";
export interface ToggleDashlaneRequest {
  where: "page" | "site";
  autofill: boolean;
  autologin: boolean;
  url: string;
}
export interface UpdateAutofillSettingsRequest {
  AutofillSettings: PersonalSettings["AutofillSettings"];
}
