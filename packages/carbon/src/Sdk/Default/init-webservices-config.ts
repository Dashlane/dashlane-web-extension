import { firstValueFrom, of, timeoutWith } from "rxjs";
import { failure, getSuccess, isSuccess } from "@dashlane/framework-types";
import {
  ApplicationBuildType,
  ApplicationModulesAccess,
  PlatformInfo,
} from "@dashlane/communication";
import { _redacted_ } from "Libs/Http/cloudflare-headers";
import { setConfig } from "config-service";
import { InitOptions } from "init-options";
const __REDACTED__ = "__REDACTED__";
function __REDACTED__(apiBaseUrl: string) {
  const re = new RegExp(__REDACTED__, "g");
  const match = apiBaseUrl.matchAll(re).next();
  if (!match.done) {
    return `__REDACTED__${match.value[1]}__REDACTED__`;
  }
  return undefined;
}
export async function initWebServicesConfig(
  options: InitOptions,
  applicationModulesAccess: ApplicationModulesAccess,
  platformInfo: PlatformInfo
) {
  try {
    if (
      ![ApplicationBuildType.DEV, ApplicationBuildType.__REDACTED__].includes(
        platformInfo.buildType
      )
    ) {
      return;
    }
    const __REDACTED__ = await firstValueFrom(
      applicationModulesAccess
        .createClients()
        .webServices.queries.__REDACTED__()
        .pipe(timeoutWith(1000, of(failure(undefined)))),
      {
        defaultValue: failure(undefined),
      }
    );
    const __REDACTED__ =
      isSuccess(__REDACTED__) && getSuccess(__REDACTED__).api;
    if (__REDACTED__?.override) {
      _redacted_(
        __REDACTED__.cloudflareAccessKeyOverride,
        __REDACTED__.cloudflareSecretKeyOverride
      );
      setConfig({
        DASHLANE_API_HOST_WITH_SCHEME: __REDACTED__.baseUrlOverride,
        DASHLANE_WS_HOST_WITH_SCHEME: __REDACTED__(
          __REDACTED__.baseUrlOverride
        ),
      });
      return;
    }
    if (options.keys.cloudflareAccess && options.keys.cloudflareSecret) {
      _redacted_(options.keys.cloudflareAccess, options.keys.cloudflareSecret);
    }
    if (options.config.DASHLANE_API_HOST_WITH_SCHEME) {
      setConfig({
        DASHLANE_API_HOST_WITH_SCHEME:
          options.config.DASHLANE_API_HOST_WITH_SCHEME,
        DASHLANE_WS_HOST_WITH_SCHEME:
          options.config.DASHLANE_WS_HOST_WITH_SCHEME ??
          __REDACTED__(options.config.DASHLANE_API_HOST_WITH_SCHEME ?? ""),
      });
    }
  } catch (error) {
    console.error(
      "[background/carbon] Failed to set webservices config overrides",
      error
    );
  }
}
