import { Capabilities } from "@dashlane/communication";
export const hasPremiumPlusCapabilities = (capabilities?: Capabilities) => {
  if (!capabilities) {
    return false;
  }
  return (
    capabilities.identityRestoration?.enabled ||
    capabilities.identityTheftProtection?.enabled ||
    capabilities.creditMonitoring?.enabled
  );
};
