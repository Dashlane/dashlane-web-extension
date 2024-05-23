import { jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
interface Props {
    children: React.ReactNode;
}
export const WebappLoginLayout = ({ children }: Props) => (<FlexContainer justifyContent="center" alignItems="center" flexDirection="column" sx={{ marginTop: '150px' }}>
    <FlexContainer justifyContent="left" flexDirection="column" gap="32px" sx={{ width: '350px', position: 'relative' }}>
      {children}
    </FlexContainer>
  </FlexContainer>);
