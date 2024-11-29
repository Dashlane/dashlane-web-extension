import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useCapabilitiesEnabled } from "../../../libs/carbon/hooks/useCapabilities";
import { useHasFeatureEnabled } from "../../../libs/carbon/hooks/useHasFeature";
export function useIsSecureFileAttachmentUploadAvailable(fromIds: boolean) {
  const isAttachmentAllowed = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.TechweekWebAttachmentsForIdsV1
  );
  const isCapabilityEnabled = useCapabilitiesEnabled(["secureFiles"]);
  const isAvailable = isCapabilityEnabled;
  const isAvailableForIds = isAvailable && isAttachmentAllowed;
  return fromIds ? isAvailableForIds : isAvailable;
}
