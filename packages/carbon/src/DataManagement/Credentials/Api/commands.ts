import {
  CreateCredentialRequest,
  CreateCredentialResult,
  UpdateCredentialRequest,
  UpdateCredentialResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type CredentialCommands = {
  addCredential: Command<CreateCredentialRequest, CreateCredentialResult>;
  updateCredential: Command<UpdateCredentialRequest, UpdateCredentialResult>;
};
