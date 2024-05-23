import { Icon, jsx } from '@dashlane/design-system';
import { DropdownElement, GridContainer, ThemeUIStyleObject, } from '@dashlane/ui-components';
interface Props {
    icon: JSX.Element;
    text: string;
    onClick: () => void;
    closeOnClick?: boolean;
    disabled?: boolean;
    hasArrowIcon?: boolean;
    sxStyle?: ThemeUIStyleObject;
}
export const MenuItem = ({ icon, text, onClick, closeOnClick, hasArrowIcon, disabled, sxStyle, }: Props) => {
    const customProps = closeOnClick ? { 'data-close-dropdown': true } : {};
    return (<DropdownElement fullWidth onClick={onClick} {...customProps} disabled={disabled} sx={{ width: '100%', ...sxStyle }}>
      <GridContainer gridTemplateColumns="1fr auto" gap="8px">
        <div sx={{
            display: 'flex',
            gap: '8px',
        }}>
          {icon}
          {text}
        </div>
        {hasArrowIcon && (<div>
            <Icon name="CaretRightOutlined"/>
          </div>)}
      </GridContainer>
    </DropdownElement>);
};
