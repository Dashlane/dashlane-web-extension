export type RedirectUserToExternalUrlParams = {
  externalUrl: string;
  tabFocus: boolean;
};
export abstract class AuthenticationFlowInfraContext {
  abstract redirectUserToExternalUrl: (
    params: RedirectUserToExternalUrlParams
  ) => void;
}
