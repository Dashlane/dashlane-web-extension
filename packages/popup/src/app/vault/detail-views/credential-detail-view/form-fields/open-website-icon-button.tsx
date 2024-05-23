import * as React from 'react';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
import { OpenWebsiteIcon } from '@dashlane/ui-components';
interface OpenWebsiteIconButtonProps {
    text: string;
    onClick: () => void;
    ariaLabel?: string;
}
const OpenWebsiteIconButtonComponent: React.FC<OpenWebsiteIconButtonProps> = ({ onClick, text, ariaLabel, }) => {
    return (<IconButtonWithTooltip tooltipContent={text} tooltipMaxWidth={162} onClick={onClick} icon={<OpenWebsiteIcon title={text}/>} aria-label={ariaLabel ?? text} role="link"/>);
};
export const OpenWebsiteIconButton = React.memo(OpenWebsiteIconButtonComponent);
