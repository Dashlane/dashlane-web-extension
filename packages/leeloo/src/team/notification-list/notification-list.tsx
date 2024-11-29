import { useCallback, useEffect, useState } from "react";
import {
  GetTeamBillingInformationResult,
  GetTeamTrialStatusResult,
  Policies,
} from "@dashlane/team-admin-contracts";
import { Lee } from "../../lee";
import useTranslate from "../../libs/i18n/useTranslate";
import { isMarkupTextKey } from "../../libs/i18n/helpers";
import { Notification } from "../../libs/notifications/types";
import { updateNotifications } from "../members/notifications/update-notifications";
import { useGetIdpErrorNotification } from "../members/notifications/use-show-idp-notification";
import { getDirectorySyncNotifications } from "../directory-sync-key/notifications";
import { getIeDropNotifications } from "../ie-drop-notification";
import { SingleNotification } from "./single-notification/single-notification";
import { NavigateTacVaultDialog } from "../../webapp/navigate-tac-vault-dialog/navigate-tac-vault-dialog";
import styles from "./styles.css";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { useTeamPolicies } from "../../libs/hooks/use-team-policies";
interface NotificationListProps {
  lee: Lee;
}
export const NotificationList = ({ lee }: NotificationListProps) => {
  const { translate } = useTranslate();
  const teamTrialStatusResult = useTeamTrialStatus();
  const teamBillingInformation = useTeamBillingInformation();
  const teamPoliciesResult = useTeamPolicies();
  const [openNavigationModal, setOpenNavigationModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const tryUpdateNotifications = useCallback(
    (
      teamTrialStatus: GetTeamTrialStatusResult | null,
      teamBillingInfo: GetTeamBillingInformationResult | null,
      teamPolicies: Policies | null
    ) => {
      if (!teamTrialStatus || !teamBillingInfo || !teamPolicies) {
        return null;
      }
      updateNotifications({
        lee: lee,
        teamTrialStatus,
        teamBillingInfo,
        teamPolicies,
        showTacInExtension: !APP_PACKAGED_IN_EXTENSION,
        translate,
      });
    },
    []
  );
  const idpNotifications = useGetIdpErrorNotification();
  const getNotifications = (): Notification[] => {
    const baseNotifs = lee.globalState.notifications.list;
    const directorySyncKeyNotifs = getDirectorySyncNotifications(lee);
    const ieNotifications = getIeDropNotifications(lee);
    return [
      ...baseNotifs,
      ...idpNotifications,
      ...directorySyncKeyNotifs,
      ...ieNotifications,
    ];
  };
  useEffect(() => {
    setNotifications(getNotifications());
  }, [
    lee.globalState.ieNotifications,
    lee.globalState.directorySyncKey,
    lee.globalState.notifications.list,
  ]);
  useEffect(() => {
    tryUpdateNotifications(
      teamTrialStatusResult,
      teamBillingInformation,
      teamPoliciesResult
    );
  }, [teamBillingInformation, teamPoliciesResult, teamTrialStatusResult]);
  return (
    <div className={styles.notifications}>
      {notifications.map((notification) => (
        <SingleNotification
          key={notification.key}
          level={notification.level}
          text={
            isMarkupTextKey(notification.textKey)
              ? translate.markup(notification.textKey, notification.keyParams)
              : notification.isPluralKey
              ? translate(notification.textKey, notification.keyParams)
              : translate(notification.textKey)
          }
          buttonTextKey={
            notification.isPluralKey && notification.buttonTextKey
              ? translate(notification.buttonTextKey, notification.keyParams)
              : notification.buttonTextKey
              ? translate(notification.buttonTextKey)
              : undefined
          }
          onClose={notification.handleClose}
          onLinkClick={notification.handleLinkClick}
          onClickButton={notification.handleButtonClick}
        />
      ))}
      {openNavigationModal ? (
        <NavigateTacVaultDialog
          isShown={openNavigationModal}
          setIsShown={setOpenNavigationModal}
          isFromVault={false}
        />
      ) : null}
    </div>
  );
};
