import type { Location } from 'history';
import { useHistory } from 'libs/router';
import { Button, jsx, Paragraph } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
export type AuthLocationState = Location<{
    ignoreRedirect?: boolean;
}>;
export interface Props {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    redirectLocation: AuthLocationState | string;
    helperText: string;
    buttonText: string;
}
export const AuthPanelNavigation = ({ onClick, redirectLocation, helperText, buttonText, }: Props) => {
    const history = useHistory();
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        history.push(redirectLocation);
    };
    return (<FlexContainer justifyContent="flex-end" alignItems="center" gap="10px" sx={{
            position: 'sticky',
            top: '40px',
            paddingRight: '40px',
            height: '40px',
        }}>
      <Paragraph color="ds.text.neutral.quiet">{helperText}</Paragraph>
      <Button mood="neutral" intensity="quiet" onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </FlexContainer>);
};
