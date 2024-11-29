import { Checkbox } from "@dashlane/design-system";
import { ChangeEvent, PropsWithChildren, useCallback } from "react";
import { logUserEventAskAuthentication } from "../../../unlock-items/logs";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { LockedItemType } from "../../../unlock-items/types";
interface Props {
  name: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  value: boolean;
  setValue: (value: boolean) => Promise<void>;
  isMpProtected?: boolean;
  disabled?: boolean;
}
const I18N_REQUIRE_MP_DIALOG_TOGGLE_ON = {
  title: "webapp_lock_items_require_master_password_for_credential_title_on",
  subtitle:
    "webapp_lock_items_require_master_password_for_credential_subtitle_on",
  confirm:
    "webapp_lock_items_require_master_password_confirm_on_for_credential",
};
const I18N_REQUIRE_MP_DIALOG_TOGGLE_OFF = {
  title: "webapp_lock_items_require_master_password_for_credential_title_off",
  subtitle:
    "webapp_lock_items_require_master_password_for_credential_subtitle_off",
  confirm:
    "webapp_lock_items_require_master_password_confirm_off_for_credential",
};
export const CredentialPreferenceSetting = ({
  name,
  title,
  description,
  setValue,
  isMpProtected = false,
  value,
  disabled = false,
}: PropsWithChildren<Props>) => {
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      const doChange = async () => {
        await setValue(newValue);
      };
      if (isMpProtected && !areProtectedItemsUnlocked) {
        logUserEventAskAuthentication();
        return openProtectedItemsUnlocker({
          itemType: LockedItemType.SecuritySettings,
          options: {
            fieldsKeys: newValue
              ? I18N_REQUIRE_MP_DIALOG_TOGGLE_ON
              : I18N_REQUIRE_MP_DIALOG_TOGGLE_OFF,
            translated: false,
          },
          successCallback: doChange,
        });
      }
      return doChange();
    },
    [
      areProtectedItemsUnlocked,
      isMpProtected,
      openProtectedItemsUnlocker,
      setValue,
    ]
  );
  const id = `setting-${name}`;
  return (
    <Checkbox
      label={title}
      description={description}
      checked={value}
      onChange={onChange}
      id={id}
      disabled={disabled}
    />
  );
};
