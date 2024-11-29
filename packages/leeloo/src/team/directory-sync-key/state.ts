import { CheckDirectorySyncKeyRequest } from "@dashlane/communication";
export interface State {
  displayDialog: boolean;
  checkDirectorySyncKeyRequest: CheckDirectorySyncKeyRequest | null;
  validationPostponed: boolean;
}
