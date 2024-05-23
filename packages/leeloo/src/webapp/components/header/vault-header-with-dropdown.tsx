import { HTMLAttributes, ReactNode } from 'react';
import { Icon, jsx } from '@dashlane/design-system';
import { DropdownElement, DropdownMenu, FlexContainer, } from '@dashlane/ui-components';
import { Header } from './header';
import { VaultHeaderButton } from './vault-header-button';
interface Props extends HTMLAttributes<HTMLDivElement> {
    buttonLabel: string;
    menuItemContents: ReactNode;
    endWidget: ReactNode;
}
interface PropsDropdownElement {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
}
const ButtonIconWrapper = ({ children }: {
    children: ReactNode;
}) => (<span sx={{ mr: '8px' }}>{children}</span>);
export const DropdownItem = ({ icon, label, onClick, }: PropsDropdownElement) => {
    return (<DropdownElement fullWidth onClick={onClick} key={label}>
      <FlexContainer flexDirection="row" flexWrap="nowrap">
        {icon ? <ButtonIconWrapper>{icon}</ButtonIconWrapper> : null}
        {label}
      </FlexContainer>
    </DropdownElement>);
};
export const VaultHeaderWithDropdown = ({ buttonLabel, endWidget, menuItemContents, ...rest }: Props) => {
    const addNewItemWidget = () => (<div sx={{ position: 'relative' }}>
      <DropdownMenu placement="bottom-start" sx={{ minWidth: '168px' }} offset={[0, 4]} content={menuItemContents}>
        <VaultHeaderButton icon={<Icon name="ActionAddOutlined"/>} isPrimary>
          {buttonLabel}
        </VaultHeaderButton>
      </DropdownMenu>
    </div>);
    return (<Header startWidgets={addNewItemWidget} endWidget={endWidget} {...rest}/>);
};
