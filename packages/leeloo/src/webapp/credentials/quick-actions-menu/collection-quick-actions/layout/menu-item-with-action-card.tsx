import { HTMLProps, ReactNode, useEffect, useRef, useState } from 'react';
import { Icon, IconName, jsx } from '@dashlane/design-system';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { MenuItem } from '../../menu/menu-item';
import { ActionType, useActiveActionContext } from '../active-action-context';
import { Card } from './card';
interface Props extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
    text: string;
    iconName: IconName;
    actionType: ActionType;
}
export const MenuItemWithActionCard = ({ children, text, iconName, actionType, ...cardProps }: Props) => {
    const { activeAction, toggleActiveAction } = useActiveActionContext();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [cardOrientation, setCardOrientation] = useState('top');
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const determineCardOrientation = () => {
        const cardElement = dropdownRef.current;
        if (!cardElement) {
            return;
        }
        const cardRect = cardElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (cardRect.top < windowHeight / 2) {
            setCardOrientation('top');
        }
        else {
            setCardOrientation('bottom');
        }
    };
    const handleClickOnMenuItem = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            toggleActiveAction(actionType);
        }
    };
    useEffect(() => {
        determineCardOrientation();
    }, []);
    if (shouldShowTrialDiscontinuedDialog === null) {
        return null;
    }
    return (<div ref={dropdownRef}>
      <MenuItem onClick={handleClickOnMenuItem} icon={<Icon name={iconName}/>} text={text} sxStyle={{
            backgroundColor: activeAction === actionType
                ? 'ds.container.expressive.brand.quiet.active'
                : 'none',
        }} hasArrowIcon/>
      {activeAction === actionType && (<div sx={{
                position: 'relative',
            }}>
          <Card cardOrientation={cardOrientation} {...cardProps}>
            {children}
          </Card>
        </div>)}
    </div>);
};
