import * as React from "react";
import classnames from "classnames";
import { Icon } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ActionState } from "./device-tile";
import styles from "./styles.css";
const I18N_KEYS = {
  DEACTIVATE_TOOLTIP: "webapp_account_devices_device_deactivate_tooltip",
};
interface Props {
  actionState: ActionState;
  handleClick: () => void;
}
export const DeviceDeactivateButton = ({ actionState, handleClick }: Props) => {
  const { translate } = useTranslate();
  return (
    <button
      type="button"
      className={classnames({
        [styles.deactivateButton]: true,
        [styles.init]: actionState === ActionState.CanRemoveDevice,
        [styles.visible]: actionState === ActionState.NamedEdited,
        [styles.hidden]: actionState === ActionState.EditInProgress,
      })}
      title={translate(I18N_KEYS.DEACTIVATE_TOOLTIP)}
      onClick={handleClick}
    >
      <Icon name="ActionCloseOutlined" color="ds.text.neutral.quiet" />
    </button>
  );
};
