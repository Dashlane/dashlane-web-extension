import * as React from "react";
import { PasswordDisplayField } from "@dashlane/design-system";
import {
  PasswordHistoryItemType,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import {
  Field,
  ItemType,
  UserRevealVaultItemFieldEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
const I18N_KEYS = {
  HIDE: "webapp_password_history_item_password_input_hide",
  SHOW: "webapp_password_history_item_password_input_show",
  PW_LABEL: "webapp_password_history_item_password_label",
};
const NOT_VISIBLE_PASSWORD_DEFAULT_VALUE = "*".repeat(20);
interface Props {
  item: PasswordHistoryItemView;
  isProtected: boolean;
}
export const PasswordHistoryItemPassword = ({ item, isProtected }: Props) => {
  const [isPasswordVisible, setVisibility] = React.useState(false);
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const onViewPasswordRequest = React.useCallback(
    (newVisibility: boolean): Promise<void> => {
      if (!newVisibility || !isProtected || areProtectedItemsUnlocked) {
        return Promise.resolve();
      }
      if (item.type === PasswordHistoryItemType.Credential) {
        return new Promise((resolve, reject) => {
          openProtectedItemsUnlocker({
            action: UnlockerAction.Show,
            itemType: LockedItemType.GeneratedPassword,
            successCallback: resolve,
            cancelCallback: reject,
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          openProtectedItemsUnlocker({
            action: UnlockerAction.Show,
            itemType: LockedItemType.GeneratedPassword,
            successCallback: resolve,
            cancelCallback: reject,
          });
        });
      }
    },
    [areProtectedItemsUnlocked, isProtected, item, openProtectedItemsUnlocker]
  );
  const logRevealPassword = () => {
    logEvent(
      new UserRevealVaultItemFieldEvent({
        field: Field.Password,
        isProtected,
        itemId: item.id,
        itemType: ItemType.Credential,
      })
    );
  };
  const onVisibilityChanged = (visible: boolean) => {
    setVisibility(visible);
    if (visible) {
      logRevealPassword();
    }
  };
  return (
    <div sx={{ flex: 1, marginRight: "32px" }}>
      <PasswordDisplayField
        label={translate(I18N_KEYS.PW_LABEL)}
        toggleVisibilityLabel={{
          hide: translate(I18N_KEYS.HIDE),
          show: translate(I18N_KEYS.SHOW),
        }}
        onValueVisibilityChange={onVisibilityChanged}
        onValueVisibilityChangeRequest={onViewPasswordRequest}
        value={
          isPasswordVisible ? item.password : NOT_VISIBLE_PASSWORD_DEFAULT_VALUE
        }
        labelPersists={false}
      />
    </div>
  );
};
