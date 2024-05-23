import { colors, FlexContainer, jsx, LoadingIcon, } from '@dashlane/ui-components';
import { ReactNode } from 'react';
export const wrapWithLoadingIcon = (child: ReactNode): ReactNode => {
    return (<FlexContainer justifyContent="center">
      <LoadingIcon sx={{ mr: '8px' }} color={colors.dashGreen00} size={18}/>
      {child}
    </FlexContainer>);
};
