import {
  AuthenticationFlowInfraContext,
  RedirectUserToExternalUrlParams,
} from "@dashlane/authentication-core";
export class WebExtensionAuthenticationFlowInfraContext
  implements AuthenticationFlowInfraContext
{
  public redirectUserToExternalUrl(
    params: RedirectUserToExternalUrlParams
  ): void {
    (async function () {
      try {
        await chrome.tabs.create({
          url: params.externalUrl,
          active: params.tabFocus,
        });
      } catch (e) {
        console.warn("[Auto-SSO] No window available. Delaying tab creation");
        const callback = () => {
          void chrome.tabs.create({
            url: params.externalUrl,
            active: params.tabFocus,
          });
          chrome.windows.onCreated.removeListener(callback);
        };
        chrome.windows.onCreated.addListener(callback);
      }
    })();
  }
}
