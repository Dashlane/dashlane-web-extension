import { slot } from "ts-event-bus";
import { type ListResults, liveSlot } from "../../CarbonApi";
import { Page } from "../../CarbonApi/pagination";
import {
  UpdateLinkedWebsitesRequest,
  UpdateLinkedWebsitesResult,
} from "../linked-websites/types";
import {
  CreateCredentialRequest,
  CreateCredentialResult,
  CredentialDataQuery,
  CredentialDetailView,
  CredentialItemView,
  CredentialsByDomainDataQuery,
  CredentialsFirstTokenParams,
  UpdateCredentialRequest,
  UpdateCredentialResult,
} from "./types";
export const credentialsCommandsSlots = {
  addCredential: slot<CreateCredentialRequest, CreateCredentialResult>(),
  updateCredential: slot<UpdateCredentialRequest, UpdateCredentialResult>(),
  updateLinkedWebsites: slot<
    UpdateLinkedWebsitesRequest,
    UpdateLinkedWebsitesResult
  >(),
};
export const credentialsQueriesSlots = {
  getCredential: slot<string, CredentialDetailView>(),
  getCredentials: slot<CredentialDataQuery, ListResults<CredentialItemView>>(),
  getCredentialsByDomain: slot<
    CredentialsByDomainDataQuery,
    ListResults<CredentialItemView>
  >(),
  getCredentialsCount: slot<CredentialDataQuery, number>(),
  getCredentialsPage: slot<string, Page<CredentialItemView>>(),
  getCredentialsPaginationToken: slot<CredentialsFirstTokenParams, string>(),
  getDashlaneDefinedLinkedWebsites: slot<string, string[]>(),
  getShouldShowRequireMasterPassword: slot<void, boolean>(),
};
export const credentialsLiveQueriesSlots = {
  liveCredential: liveSlot<CredentialDetailView | undefined>(),
  liveCredentials: liveSlot<ListResults<CredentialItemView>>(),
  liveCredentialsByDomain: liveSlot<ListResults<CredentialItemView>>(),
  liveCredentialsBatch: liveSlot<CredentialItemView[]>(),
  liveCredentialsCount: liveSlot<number>(),
};
