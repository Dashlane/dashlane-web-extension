export const BasicConfigNotFound = "BASIC_CONFIGURATION_NOT_FOUND";
export const DeactivatedTeamDevice = "DEACTIVATED_TEAM_DEVICE";
export const NotAdmin = "NOT_ADMIN";
export const UnknownTeamAdminError = "UNKNOWN_ERROR" as const;
export const DeviceKeyNotFound = "DEVICE_KEY_NOT_FOUND";
export const DeviceAccountMappingAlreadyExists =
  "DEVICE_ACCOUNT_MAPPING_ALREADY_EXISTS";
export const InvalidRequestError = "invalid_request_error";
export const InvalidTeamDeviceLogin = "INVALID_TEAM_DEVICE_LOGIN";
export const TeamDeviceEncryptedConfigNotFound =
  "TEAM_DEVICE_CONFIGURATION_NOT_FOUND";
export const InsufficientTier = "INSUFFICIENT_TIER";
export const ServerError = "server_error";
export const TeamDoesNotExist = "TEAM_DOES_NOT_EXIST";
export const DomainAlreadyExists = "DOMAIN_ALREADY_EXISTS" as const;
export const InvalidPublicDomain = "INVALID_PUBLIC_DOMAIN" as const;
export const DomainContainsNonTeamUsers =
  "DOMAIN_CONTAINS_EXISTING_NONTEAM_USERS" as const;
export const DomainNotValidForTeam = "DOMAIN_NOT_VALID_FOR_TEAM";
export const DomainCannotContainUppercaseLetters =
  "DOMAIN_CANNOT_CONTAIN_UPPERCASE_LETTERS" as const;
export const DomainNotFound = "DOMAIN_NOT_FOUND" as const;
export const DomainCannotBeDeactivated =
  "DOMAIN_CANNOT_BE_DEACTIVATED" as const;
export const DomainDeletionFailed = "DOMAIN_DELETION_FAILED" as const;
