import { LeeWithStorage } from "../../lee";
import { AuthOptions, MarketingContentType } from "../auth";
import {
  AuthenticationFlowLoginPanel,
  AuthLocationState,
} from "./authentication-flow-login-panel";
import { useLogout } from "../../libs/hooks/useLogout";
export interface State {
  noLocalAccountHasBeenRedirectToSignUpPanel: boolean;
}
export interface Props {
  lee: LeeWithStorage<State>;
  options?: AuthOptions;
  location: AuthLocationState;
}
const LoginPanel = (props: Props) => {
  const { options } = props;
  const isTACFlow =
    options?.marketingContentType === MarketingContentType.DashlaneBusiness;
  const logoutHandler = useLogout(props.lee.dispatchGlobal);
  return (
    <AuthenticationFlowLoginPanel
      location={props.location}
      isTacFlow={isTACFlow}
      logoutHandler={logoutHandler}
    />
  );
};
export default LoginPanel;
