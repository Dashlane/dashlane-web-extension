import { ValuesType } from "@dashlane/framework-types";
import {
  DomainAlreadyExists,
  DomainCannotBeDeactivated,
  DomainCannotContainUppercaseLetters,
  DomainContainsNonTeamUsers,
  DomainDeletionFailed,
  DomainNotFound,
  DomainNotValidForTeam,
  InvalidPublicDomain,
  InvalidRequestError,
  NotAdmin,
  ServerError,
  TeamDoesNotExist,
  UnknownTeamAdminError,
} from "./errors";
export const DomainStatusResponses = Object.freeze({
  pending: "pending",
  valid: "valid",
  expired: "expired",
  invalid: "invalid",
});
export type DomainStatusResponse = ValuesType<typeof DomainStatusResponses>;
export const DomainStatus = DomainStatusResponses;
export interface DomainDNSToken {
  computedToken: string;
  challengeDomain: string;
}
export interface Domain {
  id: number;
  name: string;
  status?: DomainStatusResponse;
  dnsToken?: DomainDNSToken;
  lastVerificationAttemptDateUnix?: number;
}
export interface DomainVerification {
  name: string;
  status?: DomainStatusResponse;
}
export type GetTeamDomainsResultSuccess = {
  success: true;
  domains: Domain[];
};
export type ListDomainsError =
  | typeof NotAdmin
  | typeof InvalidRequestError
  | typeof ServerError
  | typeof UnknownTeamAdminError;
export type GetTeamDomainsResultError = {
  success: false;
  error: {
    code: ListDomainsError;
  };
};
export type GetTeamDomainsResult =
  | GetTeamDomainsResultSuccess
  | GetTeamDomainsResultError;
export interface RequestDomainRegistrationRequest {
  domain: string;
}
export type RegisterTeamDomainRequest = RequestDomainRegistrationRequest;
export interface RegisterTeamDomainResultSuccess {
  success: true;
  data: {
    computedToken: string;
    challengeDomain: string;
  };
}
export type RequestDomainRegistrationError =
  | typeof TeamDoesNotExist
  | typeof DomainAlreadyExists
  | typeof NotAdmin
  | typeof InvalidPublicDomain
  | typeof UnknownTeamAdminError
  | typeof DomainNotValidForTeam
  | typeof DomainCannotContainUppercaseLetters
  | typeof DomainContainsNonTeamUsers;
export interface RegisterTeamDomainResultFailure {
  success: false;
  error: {
    code: RequestDomainRegistrationError;
  };
}
export type RegisterTeamDomainResult =
  | RegisterTeamDomainResultSuccess
  | RegisterTeamDomainResultFailure;
export interface CompleteTeamDomainResultSuccess {
  success: true;
  domains: DomainVerification[];
}
export type CompleteDomainRegistrationError =
  | typeof NotAdmin
  | typeof ServerError
  | typeof UnknownTeamAdminError;
export interface CompleteTeamDomainResultFailure {
  success: false;
  error: {
    code: CompleteDomainRegistrationError;
  };
}
export type CompleteTeamDomainResult =
  | CompleteTeamDomainResultSuccess
  | CompleteTeamDomainResultFailure;
export interface DeactivateDomainRequest {
  domain: string;
}
export type DeactivateTeamDomainRequest = DeactivateDomainRequest;
export interface DeactivateTeamDomainResultSuccess {
  success: true;
}
export type DeactivateDomainError =
  | typeof NotAdmin
  | typeof DomainCannotBeDeactivated
  | typeof DomainDeletionFailed
  | typeof DomainNotFound
  | typeof DomainNotValidForTeam
  | typeof UnknownTeamAdminError;
export interface DeactivateTeamDomainResultFailure {
  success: false;
  error: {
    code: DeactivateDomainError;
  };
}
export type DeactivateTeamDomainResult =
  | DeactivateTeamDomainResultSuccess
  | DeactivateTeamDomainResultFailure;
