import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { WebAuthnAuthenticationCommands } from "Authentication/WebAuthnAuthentication/Api/commands";
import { WebAuthnAuthenticationQueries } from "Authentication/WebAuthnAuthentication/Api/queries";
import { WebAuthnAuthenticationLiveQueries } from "Authentication/WebAuthnAuthentication/Api/live-queries";
import { initRegisterWebAuthnAuthenticator } from "Authentication/WebAuthnAuthentication/services/initRegisterWebAuthnAuthenticator";
import { registerWebAuthnAuthenticator } from "Authentication/WebAuthnAuthentication/services/registerWebAuthnAuthenticator";
import { refreshAvailableWebAuthnAuthenticators } from "Authentication/WebAuthnAuthentication/services/refreshAvailableWebAuthnAuthenticators";
import { refreshWebAuthnAuthenticators } from "Authentication/WebAuthnAuthentication/services/refreshWebAuthnAuthenticators";
import { initOpenSessionWithWebAuthnAuthenticator } from "Authentication/WebAuthnAuthentication/services/initOpenSessionWithWebAuthnAuthenticator";
import { openSessionWithWebAuthnAuthenticator } from "Authentication/WebAuthnAuthentication/services/openSessionWithWebAuthnAuthenticator";
import {
  authenticatorsSelector,
  webAuthnAuthenticationOptedInSelector,
} from "Authentication/selectors";
import {
  webAuthnAuthenticationOptedIn$,
  webAuthnAuthenticators$,
} from "Authentication/WebAuthnAuthentication/live";
import { initEnableWebAuthnAuthentication } from "Authentication/WebAuthnAuthentication/services/initEnableWebAuthnAuthentication";
import { enableWebAuthnAuthentication } from "Authentication/WebAuthnAuthentication/services/enableWebAuthnAuthentication";
import { disableWebAuthnAuthentication } from "Authentication/WebAuthnAuthentication/services/disableWebAuthnAuthentication";
import { initUserVerificationWithWebAuthn } from "Authentication/WebAuthnAuthentication/services/initUserVerificationWithWebAuthn";
import { removeWebAuthnAuthenticator } from "Authentication/WebAuthnAuthentication/services/removeWebAuthnAuthenticator";
export const config: CommandQueryBusConfig<
  WebAuthnAuthenticationCommands,
  WebAuthnAuthenticationQueries,
  WebAuthnAuthenticationLiveQueries
> = {
  commands: {
    enableWebAuthnAuthentication: {
      handler: enableWebAuthnAuthentication,
    },
    initEnableWebAuthnAuthentication: {
      handler: initEnableWebAuthnAuthentication,
    },
    initRegisterWebAuthnAuthenticator: {
      handler: initRegisterWebAuthnAuthenticator,
    },
    registerWebAuthnAuthenticator: {
      handler: registerWebAuthnAuthenticator,
    },
    refreshWebAuthnAuthenticators: {
      handler: refreshWebAuthnAuthenticators,
    },
    refreshAvailableWebAuthnAuthenticators: {
      handler: refreshAvailableWebAuthnAuthenticators,
    },
    initOpenSessionWithWebAuthnAuthenticator: {
      handler: initOpenSessionWithWebAuthnAuthenticator,
    },
    openSessionWithWebAuthnAuthenticator: {
      handler: openSessionWithWebAuthnAuthenticator,
    },
    disableWebAuthnAuthentication: {
      handler: disableWebAuthnAuthentication,
    },
    removeWebAuthnAuthenticator: {
      handler: removeWebAuthnAuthenticator,
    },
    initUserVerificationWithWebAuthn: {
      handler: initUserVerificationWithWebAuthn,
    },
  },
  queries: {
    getWebAuthnAuthenticators: {
      selector: authenticatorsSelector,
    },
    getWebAuthnAuthenticationOptedIn: {
      selector: webAuthnAuthenticationOptedInSelector,
    },
  },
  liveQueries: {
    liveWebAuthnAuthenticators: {
      operator: webAuthnAuthenticators$,
    },
    liveWebAuthnAuthenticationOptedIn: {
      operator: webAuthnAuthenticationOptedIn$,
    },
  },
};
