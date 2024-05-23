import { Icon } from '@dashlane/design-system';
import { FlexContainer, jsx, Placement } from '@dashlane/ui-components';
import { Origin } from '@dashlane/hermes';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import { useIsAllowedToShare } from 'libs/carbon/hooks/useIsAllowedToShare';
import { useIsSharingEnabledData } from 'libs/carbon/hooks/useIsSharingEnabled';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import useTranslate from 'libs/i18n/useTranslate';
import { HEADER_BREAKPOINT_SIZE } from 'webapp/components/header/constants';
import { useDialog } from 'webapp/dialog';
import { Sharing } from 'webapp/sharing-invite/types';
import { SharingInviteDialog } from './sharing-invite-dialog';
import { SharingLimitReachedDialog } from './limit-reached';
import { useIsHeaderWidthAboveSize } from 'webapp/components/header/useIsHeaderWidthAboveSize';
const I18N_KEYS = {
    SHARE_ITEM: 'webapp_sharing_center_share_item',
    SHARING_DISABLED: 'team_sharing_disabled',
    SHARING_DISABLED_DESCRIPTION: 'team_sharing_disabled_description',
};
interface SharingButtonProps {
    hideIcon?: boolean;
    sharing: Sharing;
    text?: string;
    tooltipPlacement?: Placement;
    origin: Origin;
}
export const SharingButton = ({ hideIcon = false, sharing, text, origin, tooltipPlacement = 'bottom-start', }: SharingButtonProps) => {
    const { openDialog, closeDialog } = useDialog();
    const isSharingEnabled = useIsSharingEnabledData();
    const isAllowedToShare = useIsAllowedToShare();
    const { translate } = useTranslate();
    const isHeaderWidthAboveSize = useIsHeaderWidthAboveSize(HEADER_BREAKPOINT_SIZE);
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    if (shouldShowTrialDiscontinuedDialog === null) {
        return null;
    }
    const handleClick = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else if (isAllowedToShare && sharing) {
            openDialog(<SharingInviteDialog sharing={sharing} onDismiss={closeDialog} origin={origin}/>);
        }
        else {
            openDialog(<SharingLimitReachedDialog closeDialog={closeDialog}/>);
        }
    };
    return (<DisabledButtonWithTooltip onClick={handleClick} mood="neutral" intensity="supershy" size="medium" icon={!hideIcon && (<Icon name="ActionShareOutlined" color="ds.text.neutral.standard"/>)} layout={isHeaderWidthAboveSize ? 'iconLeading' : 'iconOnly'} disabled={!isSharingEnabled} placement={tooltipPlacement} content={<FlexContainer flexDirection="column" alignItems="flex-start" sx={{ padding: '16px', borderRadius: '8px', textAlign: 'left' }}>
          <div sx={{ paddingBottom: '8px', fontWeight: '600', fontSize: '18px' }}>
            {translate(I18N_KEYS.SHARING_DISABLED)}
          </div>
          <div>{translate(I18N_KEYS.SHARING_DISABLED_DESCRIPTION)}</div>
        </FlexContainer>}>
      {text ?? translate(I18N_KEYS.SHARE_ITEM)}
    </DisabledButtonWithTooltip>);
};
