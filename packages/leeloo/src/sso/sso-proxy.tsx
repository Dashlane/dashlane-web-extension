import { useIsLegacyAuthenticationFlowForced } from "../auth/login-panel/authentication-flow/hooks/use-is-legacy-authentication-flow-forced";
import { Sso } from "../auth/login-panel/authentication-flow/steps";
import { Props } from "./types";
import { SsoLegacy } from "./sso-legacy";
export const SsoProxy = (props: Props) => {
  const { loading } = useIsLegacyAuthenticationFlowForced();
  const isNewLoginFlowEnabled = false;
  return !loading ? (
    isNewLoginFlowEnabled ? (
      <Sso {...props} />
    ) : (
      <SsoLegacy {...props} />
    )
  ) : null;
};
