import {
  DomainPendingReason,
  DomainVerificationInfo,
  DomainVerificationStatus,
} from "@dashlane/sso-scim-contracts";
export const I18N_KEYS = {
  ERROR_SSO_INVALID_TOKEN:
    "sso_confidential_verify_domain_step_domain_input_feedback_sso_error_invalid_token",
  ERROR_SSO_TOKEN_NOT_FOUND:
    "sso_confidential_verify_domain_modal_error_infobox_title_token_not_found",
  ERROR_SSO_TOKEN_NOT_FOUND_DESCRIPTION:
    "sso_confidential_verify_domain_modal_error_infobox_description_token_not_found",
  ERROR_SSO_GENERIC:
    "sso_confidential_verify_domain_modal_error_infobox_title_generic_error",
};
export type DomainError = {
  data?: string | null;
  description?: string;
  title: string;
};
export const getError = ({
  pendingReason,
  tokenFound,
  verificationStatus,
}: DomainVerificationInfo): DomainError | null => {
  if (
    verificationStatus === DomainVerificationStatus.enum.pending &&
    pendingReason === DomainPendingReason.enum.invalidToken
  ) {
    return { title: I18N_KEYS.ERROR_SSO_INVALID_TOKEN, data: tokenFound };
  }
  if (
    verificationStatus === DomainVerificationStatus.enum.pending &&
    pendingReason === DomainPendingReason.enum.tokenNotFound
  ) {
    return {
      title: I18N_KEYS.ERROR_SSO_TOKEN_NOT_FOUND,
      description: I18N_KEYS.ERROR_SSO_TOKEN_NOT_FOUND_DESCRIPTION,
    };
  }
  if (verificationStatus === DomainVerificationStatus.enum.invalid) {
    return { title: I18N_KEYS.ERROR_SSO_GENERIC };
  }
  return null;
};
