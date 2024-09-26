export interface LinkedWebsites {
  addedByDashlane: string[];
  addedByUser: string[];
}
export type UpdateLinkedWebsitesRequest = {
  credentialId: string;
  updatedLinkedWebsitesDomainList: string[];
};
export interface UpdateLinkedWebsitesSuccess {
  success: true;
}
export enum UpdateLinkedWebsitesError {
  CredentialUpdateError = "credentialUpdateError",
}
export interface UpdateLinkedWebsitesFailure {
  success: false;
  error: UpdateLinkedWebsitesError;
}
export type UpdateLinkedWebsitesResult =
  | UpdateLinkedWebsitesSuccess
  | UpdateLinkedWebsitesFailure;
