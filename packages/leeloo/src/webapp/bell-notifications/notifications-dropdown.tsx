import * as React from "react";
import { PageView } from "@dashlane/hermes";
import { Button, Icon } from "@dashlane/design-system";
import { Notifications } from "@dashlane/communication";
import { BellBadgeIcon } from "@dashlane/ui-components";
import {
  Dropdown,
  DropdownAlignment,
  DropdownPosition,
} from "../../libs/dashlane-style/dropdown";
import { logPageView } from "../../libs/logs/logEvent";
import { logCurrentRoutePageView } from "../../libs/logs/pageViewUtils";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { useLocation } from "../../libs/router";
import useTranslate from "../../libs/i18n/useTranslate";
import { NotificationsHub } from "../notifications-hub/notifications-hub";
import { useHasNotifications } from "./use-has-notifications";
export interface Props {
  invertColors?: boolean;
  notifications: Notifications;
}
const I18N_KEYS = {
  VIEW_NOTIFICATIONS: "webapp_sharing_notifications_view_notifications",
};
const NotificationsDropdown: React.FC<Props> = ({ invertColors = false }) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const hasNotifications = useHasNotifications();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const wasOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    wasOpenRef.current = isOpen;
  });
  const wasOpen = wasOpenRef.current;
  React.useEffect(() => {
    if (isOpen && !wasOpen) {
      logPageView(PageView.NotificationSharingList);
    } else if (!isOpen && wasOpen) {
      logCurrentRoutePageView(location.pathname, routes);
    }
  }, [isOpen, location, routes, wasOpen]);
  const onToggle = React.useCallback(
    (newIsOpen: boolean) => {
      setIsOpen(newIsOpen);
    },
    [setIsOpen]
  );
  const renderMenuItem = React.useCallback(
    (toggle: () => void) => {
      const NotificationIcon =
        isOpen || !hasNotifications ? (
          <Icon name="NotificationOutlined" style={{ pointerEvents: "none" }} />
        ) : (
          <BellBadgeIcon
            style={{ pointerEvents: "none" }}
            color="ds.text.neutral.standard"
          />
        );
      return (
        <div
          sx={{
            display: "inline-block",
            height: "100%",
          }}
        >
          <Button
            onClick={toggle}
            aria-label={translate(I18N_KEYS.VIEW_NOTIFICATIONS)}
            mood={invertColors ? "brand" : "neutral"}
            intensity={invertColors ? "catchy" : "supershy"}
            layout="iconOnly"
            icon={NotificationIcon}
          />
        </div>
      );
    },
    [invertColors, hasNotifications, isOpen, translate]
  );
  return (
    <Dropdown
      alignment={DropdownAlignment.End}
      position={DropdownPosition.Bottom}
      onToggle={onToggle}
      withBackdrop={true}
      renderRoot={renderMenuItem}
    >
      <NotificationsHub />
    </Dropdown>
  );
};
export default NotificationsDropdown;
