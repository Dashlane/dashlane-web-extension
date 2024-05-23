import * as React from 'react';
import { CopyIcon } from '@dashlane/ui-components';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
interface CopyIconButtonProps {
    text: string;
    copyAction: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}
const CopyIconButtonComponent: React.FC<CopyIconButtonProps> = ({ copyAction, text, disabled = false, }) => {
    return (<IconButtonWithTooltip tooltipContent={text} tooltipMaxWidth={162} onClick={(event) => {
            if (event.detail !== 0) {
                event.currentTarget.blur();
            }
            copyAction(event);
        }} disabled={disabled} icon={<CopyIcon title={text}/>}/>);
};
export const CopyIconButton = React.memo(CopyIconButtonComponent);
