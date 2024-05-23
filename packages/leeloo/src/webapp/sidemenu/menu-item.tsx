import { Fragment, FunctionComponent, ReactNode } from 'react';
import classnames from 'classnames';
import { FlexContainer, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DisabledLink, Link } from 'webapp/sidemenu/links';
import { UpgradeBadge } from 'webapp/paywall/upgrade-badge-tsx';
import { MenuItemTooltip } from './menu-item-tooltip';
import styles from './styles.css';
interface NotificationProps {
    cancelLabel?: string;
    confirmLabel?: string;
    description: string;
    notificationClass?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    showNotification: boolean;
    title: string;
}
interface IconWrapperProps {
    collapsedChip?: React.FC;
    icon?: React.FC;
    disabled?: boolean;
}
export interface Props extends IconWrapperProps {
    children?: ReactNode;
    disabledNotification?: NotificationProps;
    enabledNotification?: NotificationProps;
    hidden?: boolean;
    onClick?: () => void;
    rightIcon?: React.FC;
    rightComponent?: React.FC;
    showPaywallTag?: boolean;
    text?: string;
    threeDotsComponent?: ReactNode;
    to: string;
    wrapperClass?: string;
}
const IconWrapper = ({ collapsedChip: CollapsedChip, icon: Icon, disabled, }: IconWrapperProps) => {
    const iconClass = classnames(styles.icon, disabled && styles.disabled);
    if (!Icon && !CollapsedChip) {
        return null;
    }
    return (<div className={iconClass}>
      {CollapsedChip && (<div className={styles.collapsedChip}>
          <CollapsedChip />
        </div>)}
      {Icon && <Icon />}
    </div>);
};
const PaywallTagWrapper = ({ showPaywallTag }: {
    showPaywallTag: boolean;
}) => {
    return showPaywallTag ? <UpgradeBadge /> : null;
};
const RightIconWrapper = ({ rightIcon: RightIcon }: {
    rightIcon?: React.FC;
}) => RightIcon ? (<div className={styles.lockIconContainer}>
      <div className={styles.chip}>
        <RightIcon />
      </div>
    </div>) : null;
interface RightComponentWrapperProps {
    component?: FunctionComponent;
}
const RightComponentWrapper = ({ component: Component, }: RightComponentWrapperProps): JSX.Element | null => {
    return Component ? (<FlexContainer justifyContent="center" alignContent="center">
      <Component />
    </FlexContainer>) : null;
};
export const MenuItem = ({ children, collapsedChip, disabled, disabledNotification, enabledNotification, hidden, icon, onClick, rightIcon, rightComponent, text, to, showPaywallTag, threeDotsComponent, wrapperClass, }: Props) => {
    const { translate } = useTranslate();
    if (hidden) {
        return null;
    }
    const Item = () => (<>
      <IconWrapper collapsedChip={collapsedChip} icon={icon} disabled={disabled}/>
      <div className={styles.itemTextContainer}>
        {text && <div className={styles.itemText}>{translate(text)}</div>}
        {children}
        
        <PaywallTagWrapper showPaywallTag={!!showPaywallTag}/>
      </div>
      <RightIconWrapper rightIcon={rightIcon}/>
      <RightComponentWrapper component={rightComponent}/>
    </>);
    if (disabled) {
        return (<MenuItemTooltip showNotification={disabledNotification?.showNotification ?? true} title={disabledNotification?.title} description={disabledNotification?.description}>
        <span>
          <DisabledLink to={to} className={wrapperClass}>
            <Item />
          </DisabledLink>
        </span>
      </MenuItemTooltip>);
    }
    return (<MenuItemTooltip trigger="persist" showNotification={enabledNotification?.showNotification ?? true} {...enabledNotification}>
      <div sx={{
            display: 'flex',
            alignItems: 'stretch',
        }}>
        <Link to={to} className={wrapperClass} sx={{ flexGrow: 1 }} onClick={onClick}>
          <Item />
        </Link>
        {threeDotsComponent}
      </div>
    </MenuItemTooltip>);
};
