import { AppLogger } from "@dashlane/framework-application";
import { ExtensionLocalStorageInfrastructure } from "@dashlane/framework-infra/storage";
export const logger = AppLogger.create({
  container: "background",
  module: "amphora",
  domain: "no-domain",
  infra: new ExtensionLocalStorageInfrastructure(),
});
