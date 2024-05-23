import { jsx, Placement } from '@dashlane/ui-components';
import { DisabledButtonWithTooltip } from 'libs/dashlane-style/buttons/DisabledButtonWithTooltip';
import useTranslate from 'libs/i18n/useTranslate';
interface EditPermissionButtonProps {
    isDisabled: boolean;
    onClick: () => void;
    tooltipTitle?: string;
    tooltipPlacement?: Placement;
}
export const EditPermissionButton = ({ isDisabled, onClick, tooltipTitle = '', tooltipPlacement = 'top', }: EditPermissionButtonProps) => {
    const { translate } = useTranslate();
    return (<DisabledButtonWithTooltip disabled={isDisabled} size={'medium'} mood={'brand'} intensity={'supershy'} onClick={onClick} content={tooltipTitle} placement={tooltipPlacement} tooltipSx={{ maxWidth: '170px' }}>
      {translate('webapp_sharing_center_panel_permission_button')}
    </DisabledButtonWithTooltip>);
};
