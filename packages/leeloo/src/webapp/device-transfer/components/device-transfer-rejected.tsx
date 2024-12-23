import React from "react";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { Button, Flex, Icon, Paragraph } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
type Props = Omit<
  DeviceTransferContracts.TrustedDeviceFlowDeviceTransferRejectedView,
  "step"
>;
export const I18N_KEYS = {
  DESCRIPTION: "webapp_device_transfer_page_rejected_description_markup",
  BACK_BUTTON: "webapp_device_transfer_page_rejected_button",
};
export const DeviceTransferRejected = ({ untrustedDeviceName }: Props) => {
  const { translate } = useTranslate();
  const { returnToDeviceSetup } = useModuleCommands(
    DeviceTransferContracts.deviceTransferApi
  );
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap={24}
      style={{ margin: "16px 0" }}
    >
      <Icon
        color="ds.border.brand.standard.active"
        name="FeedbackSuccessOutlined"
        style={{ width: 100, height: 100 }}
      />
      <Paragraph
        textStyle="ds.title.block.medium"
        style={{ width: 300, textAlign: "center" }}
      >
        {translate.markup(I18N_KEYS.DESCRIPTION, {
          deviceName: untrustedDeviceName,
        })}
      </Paragraph>
      <Button onClick={() => returnToDeviceSetup()}>
        {translate(I18N_KEYS.BACK_BUTTON)}
      </Button>
    </Flex>
  );
};
