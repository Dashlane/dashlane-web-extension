import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { confidentialSSOApi, SsoSolution } from "@dashlane/sso-scim-contracts";
import { SCIMPaywall } from "../directory-sync/scim-provisioning/scim-paywall";
interface SCIMInfoboxProps {
  isSCIMCapable: boolean | null;
  isTrialOrGracePeriod?: boolean;
  showPaywall?: boolean;
}
export const SCIMInfobox = ({
  isSCIMCapable,
  isTrialOrGracePeriod,
  showPaywall,
}: SCIMInfoboxProps) => {
  const { data: ssoState, status: ssoStateStatus } = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  if (ssoStateStatus !== DataStatus.Success) {
    return null;
  }
  const { ssoSolution } = ssoState;
  if (ssoSolution === SsoSolution.enum.confidentialSaml) {
    throw new Error(
      "Invalid state: cannot access SCIM if the team is using Confidential SSO until the enclave supports SCIM."
    );
  }
  if (
    isSCIMCapable === false &&
    showPaywall &&
    isTrialOrGracePeriod !== undefined
  ) {
    return <SCIMPaywall isTrialOrGracePeriod={isTrialOrGracePeriod} />;
  }
  return null;
};
