import { Secret } from "@dashlane/communication";
import { State } from "Store";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { secretsSelector } from "./selectors/secrets.selector";
export const secretSelector = (state: State, secretId: string): Secret => {
  const secrets = secretsSelector(state);
  return findDataModelObject(secretId, secrets);
};
