import { jsx } from '@dashlane/design-system';
import { PropsWithChildren } from 'react';
import { Lockup, LockupColor, LockupSize } from '@dashlane/ui-components';
interface Props {
    backgroundColor?: string;
}
export const BaseMarketingContainer = ({ children, backgroundColor = 'ds.background.alternate', }: PropsWithChildren<Props>) => {
    return (<div sx={{
            backgroundColor,
            minHeight: '100%',
            width: '100%',
        }}>
      <div sx={{
            position: 'sticky',
            paddingLeft: '80px',
            top: '50px',
        }}>
        <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39}/>
      </div>
      {children}
    </div>);
};
