import { FunctionComponent, ReactNode } from "react";
import classnames from "classnames";
import useTranslate from "../../libs/i18n/useTranslate";
import { DisabledLink, Link } from "./links";
import { UpgradeBadge } from "../paywall/upgrade-badge-tsx";
import { MenuItemTooltip } from "./menu-item-tooltip";
import styles from "./styles.css";
import {
  Flex,
  Icon,
  IconName,
  IconProps,
  Paragraph,
} from "@dashlane/design-system";
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
  collapsedChip?: IconName;
  iconName?: IconName;
  disabled?: boolean;
}
export interface Props extends IconWrapperProps {
  children?: ReactNode;
  disabledNotification?: NotificationProps;
  enabledNotification?: NotificationProps;
  hidden?: boolean;
  onClick?: () => void;
  rightIcon?: IconName;
  rightComponent?: React.FC;
  showPaywallTag?: boolean;
  text?: string;
  threeDotsComponent?: ReactNode;
  to: string;
  wrapperClass?: string;
}
const IconWrapper = ({
  collapsedChip,
  iconName,
  disabled,
}: IconWrapperProps) => {
  const iconClass = classnames(styles.icon, disabled && styles.disabled);
  const color = disabled
    ? "ds.text.oddity.disabled"
    : "ds.text.neutral.standard";
  if (!iconName && !collapsedChip) {
    return null;
  }
  return (
    <div className={iconClass}>
      {collapsedChip && (
        <div className={styles.collapsedChip}>
          <Icon name={collapsedChip} color={color} />
        </div>
      )}
      {iconName && <Icon name={iconName} color={color} />}
    </div>
  );
};
const PaywallTagWrapper = ({ showPaywallTag }: { showPaywallTag: boolean }) => {
  return showPaywallTag ? <UpgradeBadge /> : null;
};
const RightIconWrapper = ({ rightIcon }: { rightIcon?: IconProps["name"] }) =>
  rightIcon ? (
    <div className={styles.lockIconContainer}>
      <div className={styles.chip}>
        <Icon name={rightIcon} color="ds.text.neutral.standard" />
      </div>
    </div>
  ) : null;
interface RightComponentWrapperProps {
  component?: FunctionComponent;
}
const RightComponentWrapper = ({
  component: Component,
}: RightComponentWrapperProps): JSX.Element | null => {
  return Component ? (
    <Flex justifyContent="center" alignContent="center">
      <Component />
    </Flex>
  ) : null;
};
export const MenuItem = ({
  children,
  collapsedChip,
  disabled,
  disabledNotification,
  enabledNotification,
  hidden,
  iconName,
  onClick,
  rightIcon,
  rightComponent,
  text,
  to,
  showPaywallTag,
  threeDotsComponent,
  wrapperClass,
}: Props) => {
  const { translate } = useTranslate();
  if (hidden) {
    return null;
  }
  const Item = () => (
    <>
      <IconWrapper
        collapsedChip={collapsedChip}
        iconName={iconName}
        disabled={disabled}
      />
      <div className={styles.itemTextContainer}>
        {text ? (
          <Paragraph
            as="div"
            className={styles.itemText}
            textStyle="ds.title.block.medium"
            color={
              disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.catchy"
            }
          >
            {translate(text)}
          </Paragraph>
        ) : null}
        {children}

        <PaywallTagWrapper showPaywallTag={!!showPaywallTag} />
      </div>
      <RightIconWrapper rightIcon={rightIcon} />
      <RightComponentWrapper component={rightComponent} />
    </>
  );
  if (disabled) {
    return (
      <MenuItemTooltip
        showNotification={disabledNotification?.showNotification ?? true}
        title={disabledNotification?.title}
        description={disabledNotification?.description}
      >
        <span>
          <DisabledLink to={to} className={wrapperClass}>
            <Item />
          </DisabledLink>
        </span>
      </MenuItemTooltip>
    );
  }
  return (
    <MenuItemTooltip
      trigger="persist"
      showNotification={enabledNotification?.showNotification ?? true}
      {...enabledNotification}
    >
      <div
        sx={{
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <Link
          to={to}
          className={wrapperClass}
          sx={{
            flexGrow: 1,
            "&:hover + button:first-of-type,&:focus-within + button:first-of-type":
              {
                backgroundColor:
                  "ds.container.expressive.neutral.supershy.hover",
              },
          }}
          onClick={onClick}
        >
          <Item />
        </Link>
        {threeDotsComponent}
      </div>
    </MenuItemTooltip>
  );
};
