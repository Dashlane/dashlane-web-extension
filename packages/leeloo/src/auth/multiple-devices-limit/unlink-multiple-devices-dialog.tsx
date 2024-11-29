import {
  colors,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
  Paragraph,
} from "@dashlane/ui-components";
import * as React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { DeviceToDeactivateInfo } from "./device-to-deactivate-info";
import {
  dismissUnlinkDeviceLog,
  unlinkPreiousDeviceLog,
  upgradePremiumLog,
} from "../device-limit-flow/logs";
import {
  DeviceToDeactivateInfoView,
  UnlinkMultipleDevicesRequest,
} from "@dashlane/communication";
const I18N_KEYS = {
  UPGRADE_BUTTON: "webapp_login_multiple_devices_limit_dialog_cancel",
  TEXT: "webapp_login_multiple_devices_limit_dialog_text_markup",
  TITLE: "webapp_login_multiple_devices_limit_dialog_title",
  UNLINK_BUTTON: "webapp_login_multiple_devices_limit_dialog_unlink",
  CLOSE: "_common_dialog_dismiss_button",
};
interface UnlinkMultipleDevicesDialogProps {
  isOpen: boolean;
  handleOnCancel: () => void;
  handleOnConfirm: (params: UnlinkMultipleDevicesRequest) => void;
  onHandleGoToPremiumPlan: () => void;
  devicesToDeactivate: DeviceToDeactivateInfoView[] | undefined;
}
const TWO_DEVICES_LIMIT = 2;
export const UnlinkMultipleDevicesDialog = ({
  isOpen,
  devicesToDeactivate,
  handleOnConfirm,
  handleOnCancel,
  onHandleGoToPremiumPlan,
}: UnlinkMultipleDevicesDialogProps) => {
  const [chosenDevicesToBeUnlinked, setChosenDevicesToBeUnlinked] =
    React.useState<string[]>([]);
  const { translate } = useTranslate();
  const limit = (devicesToDeactivate?.length ?? 0) - TWO_DEVICES_LIMIT;
  const enoughDevicesSelected = chosenDevicesToBeUnlinked.length >= limit;
  const onClose = () => {
    handleOnCancel();
    dismissUnlinkDeviceLog();
  };
  const onSecondaryButtonClick = () => {
    onHandleGoToPremiumPlan();
    upgradePremiumLog();
  };
  const handleOnSelection = (device: DeviceToDeactivateInfoView) => {
    if (chosenDevicesToBeUnlinked.includes(device.deviceId)) {
      setChosenDevicesToBeUnlinked(
        chosenDevicesToBeUnlinked.filter((id) => id !== device.deviceId)
      );
    } else {
      setChosenDevicesToBeUnlinked([
        ...chosenDevicesToBeUnlinked,
        device.deviceId,
      ]);
    }
  };
  const formatParams = () => {
    return chosenDevicesToBeUnlinked.reduce((memo, id) => {
      const deviceInfo = devicesToDeactivate?.find(
        ({ deviceId }) => deviceId === id
      );
      if (deviceInfo?.isPairingGroup) {
        if (memo.pairingGroupIds) {
          memo.pairingGroupIds.push(deviceInfo?.deviceId);
        } else {
          memo["pairingGroupIds"] = [deviceInfo?.deviceId];
        }
      } else if (deviceInfo) {
        if (memo.deviceIds) {
          memo.deviceIds.push(deviceInfo?.deviceId);
        } else {
          memo["deviceIds"] = [deviceInfo?.deviceId];
        }
      }
      return memo;
    }, {} as UnlinkMultipleDevicesRequest);
  };
  const onPrimaryButtonClick = () => {
    handleOnConfirm(formatParams());
    unlinkPreiousDeviceLog();
  };
  return (
    <Dialog
      closeIconName={translate(I18N_KEYS.CLOSE)}
      isOpen={isOpen}
      onClose={onClose}
    >
      <DialogTitle title={translate(I18N_KEYS.TITLE)} />
      <Paragraph
        color={colors.grey00}
        sx={{
          marginBottom: "20px",
        }}
      >
        {translate.markup(I18N_KEYS.TEXT)}
      </Paragraph>
      <DialogBody>
        {devicesToDeactivate
          ? devicesToDeactivate.map((deviceToDeactivate) => (
              <DeviceToDeactivateInfo
                key={deviceToDeactivate.deviceId}
                deviceToDeactivate={deviceToDeactivate}
                handleOnSelection={handleOnSelection}
                checked={chosenDevicesToBeUnlinked.includes(
                  deviceToDeactivate.deviceId
                )}
              />
            ))
          : null}
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.UNLINK_BUTTON)}
        primaryButtonOnClick={onPrimaryButtonClick}
        primaryButtonProps={{
          type: "button",
          disabled: !enoughDevicesSelected,
        }}
        secondaryButtonTitle={translate(I18N_KEYS.UPGRADE_BUTTON)}
        secondaryButtonOnClick={onSecondaryButtonClick}
        secondaryButtonProps={{
          type: "button",
        }}
      />
    </Dialog>
  );
};
