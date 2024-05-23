import { Key } from 'react';
import { PropsOf, ThemeUIStyleObject, Tooltip } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
interface DisabledButtonWithTooltipProps extends PropsOf<typeof Button>, Pick<PropsOf<typeof Tooltip>, 'placement' | 'content'> {
    loading?: boolean;
    key?: Key | undefined;
    neverShowTooltip?: boolean;
    tooltipSx?: ThemeUIStyleObject;
}
export const DisabledButtonWithTooltip = ({ loading = false, content, children, mood, intensity, placement, neverShowTooltip, tooltipSx, ...buttonProps }: DisabledButtonWithTooltipProps) => (<Tooltip content={content} passThrough={!buttonProps.disabled || loading || neverShowTooltip} placement={placement} sx={tooltipSx ? tooltipSx : {}}>
    <span sx={{
        display: 'inline-block',
        cursor: buttonProps.disabled ? 'not-allowed' : 'auto',
    }}>
      <Button {...buttonProps} mood={mood} intensity={intensity} sx={buttonProps.disabled ? { pointerEvents: 'none' } : {}} isLoading={loading} disabled={buttonProps.disabled || loading}>
        {children}
      </Button>
    </span>
  </Tooltip>);
