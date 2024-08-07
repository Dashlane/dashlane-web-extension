import { CarbonConfig } from "@dashlane/carbon";
import { runtimeGetManifest } from "@dashlane/webextensions-apis";
import { getDashlaneApiOverrides } from "./dashlane-api-overrides";
export const config: Partial<CarbonConfig> = {
  LOG_LEVEL: INTERNAL_LOG_LEVEL,
  CODE_NAME: "amphora",
  MANIFEST_VERSION: runtimeGetManifest().manifest_version,
  ...getDashlaneApiOverrides(),
};
