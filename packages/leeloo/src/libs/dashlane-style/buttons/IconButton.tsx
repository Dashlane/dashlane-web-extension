import { Button, jsx, PropsOf } from '@dashlane/ui-components';
import { forwardRef, Key, ReactNode } from 'react';
interface IconButtonProps extends PropsOf<typeof Button> {
    icon: ReactNode;
    key?: Key | undefined;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, style, ...buttonProps }, ref) => {
    return (<Button style={{ padding: '10px', minWidth: 'auto', ...style }} {...buttonProps} ref={ref}>
        {icon}
      </Button>);
});
