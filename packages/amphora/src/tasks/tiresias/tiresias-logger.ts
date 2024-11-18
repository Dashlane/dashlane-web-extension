import { AppLogger } from "@dashlane/framework-application";
import { ExtensionLocalStorageInfrastructure } from "@dashlane/framework-infra/storage";
export const tiresiasLogger = AppLogger.create({
  container: "background",
  module: "tiresias",
  domain: "no-domain",
  infra: new ExtensionLocalStorageInfrastructure(),
});
