import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  CreateCredentialRequest,
  CreateCredentialResult,
  UpdateCredentialRequest,
} from "@dashlane/communication";
import { AutofillEngineContext } from "../../../Api/server/context";
import { getAutofillDataFromVault } from "../../abstractions/vault/get";
import { updateCollection } from "./collections-helper";
import { checkHasSharedCollectionInSaveWebcard } from "../../../config/feature-flips";
import { WebcardCollectionData } from "../../../types";
const EMAIL_REGEXP =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const isValidEmail = (value: string): boolean => {
  return EMAIL_REGEXP.test(value);
};
export const saveCredential = async (
  context: AutofillEngineContext,
  credentialInformation: {
    emailOrLogin: string;
    capturedUsernames: {
      email: string;
      login: string;
      secondaryLogin: string;
    };
    password: string;
    url: string;
    onlyForThisSubdomain: boolean;
    protectWithMasterPassword: boolean;
    spaceId?: string;
    selectedCollection?: WebcardCollectionData;
  }
): Promise<CreateCredentialResult> => {
  const {
    emailOrLogin,
    capturedUsernames,
    password,
    url,
    onlyForThisSubdomain,
    protectWithMasterPassword,
    spaceId,
    selectedCollection,
  } = credentialInformation;
  const isEmailOrLoginAnEmail = isValidEmail(emailOrLogin);
  const credentialObject: CreateCredentialRequest = {
    email: isEmailOrLoginAnEmail ? emailOrLogin : capturedUsernames.email,
    login: !isEmailOrLoginAnEmail ? emailOrLogin : capturedUsernames.login,
    secondaryLogin: capturedUsernames.secondaryLogin,
    password,
    url,
    onlyForThisSubdomain,
    protectWithMasterPassword,
    spaceId,
  };
  const addCredentialResult = await context.connectors.carbon.addCredential(
    credentialObject
  );
  if (
    (await checkHasSharedCollectionInSaveWebcard(context.connectors)) &&
    selectedCollection
  ) {
    await updateCollection(context, selectedCollection, addCredentialResult);
  }
  return addCredentialResult;
};
export const updateCredential = (
  context: AutofillEngineContext,
  credentialInformation: {
    id: string;
    passwordToSave: string;
    onlyForThisSubdomain: boolean;
    spaceId?: string;
  }
) => {
  const { id, passwordToSave, onlyForThisSubdomain, spaceId } =
    credentialInformation;
  const credentialObject: UpdateCredentialRequest = {
    id,
    update: {
      password: passwordToSave,
      spaceId,
      onlyForThisSubdomain,
    },
  };
  return context.connectors.carbon.updateCredential(credentialObject);
};
export const getCredentialPassword = async (
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  credentialId: string
) => {
  const existingCredential = await getAutofillDataFromVault(
    context,
    VaultSourceType.Credential,
    credentialId,
    sender.tab?.url ?? ""
  );
  if (existingCredential) {
    return existingCredential.password;
  } else {
    throw new Error("This credential does not exist");
  }
};
