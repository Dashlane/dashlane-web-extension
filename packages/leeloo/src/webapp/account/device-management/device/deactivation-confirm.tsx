import useTranslate from "../../../../libs/i18n/useTranslate";
import { Button } from "@dashlane/design-system";
export const I18N_KEYS = {
  CANCEL_DEACTIVATE_BUTTON:
    "webapp_account_devices_device_cancel_deactivate_button",
  CONFIRM_DEACTIVATE_BUTTON:
    "webapp_account_devices_device_confirm_deactivate_button",
};
interface ConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}
export const DeactivationConfirm = ({ onConfirm, onCancel }: ConfirmProps) => {
  const { translate } = useTranslate();
  return (
    <div>
      <Button
        sx={{ marginRight: "8px" }}
        intensity="quiet"
        size="small"
        onClick={onCancel}
      >
        {translate(I18N_KEYS.CANCEL_DEACTIVATE_BUTTON)}
      </Button>
      <Button mood="danger" size="small" onClick={onConfirm}>
        {translate(I18N_KEYS.CONFIRM_DEACTIVATE_BUTTON)}
      </Button>
    </div>
  );
};
