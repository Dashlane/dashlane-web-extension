import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
export function useIsSecureNoteAttachmentEnabled() {
    return useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.SaexSecureNoteAttachmentsForrelease);
}
