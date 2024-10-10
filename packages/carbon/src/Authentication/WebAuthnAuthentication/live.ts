import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import {
  authenticatorsSelector,
  webAuthnAuthenticationOptedInSelector,
} from "Authentication/selectors";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
import { StateOperator } from "Shared/Live";
export const webAuthnAuthenticators$ = (): StateOperator<
  AuthenticatorDetails[]
> => pipe(map(authenticatorsSelector), distinctUntilChanged());
export const webAuthnAuthenticationOptedIn$ = (): StateOperator<boolean> =>
  pipe(map(webAuthnAuthenticationOptedInSelector), distinctUntilChanged());
