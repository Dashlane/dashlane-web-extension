import { fromUnixTime } from "date-fns";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { ActionDuringTransfer, UserAddNewDeviceEvent } from "@dashlane/hermes";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
type Props = Omit<
  DeviceTransferContracts.TrustedDeviceFlowNewRequestView,
  "step"
>;
export const I18N_KEYS = {
  TITLE: "webapp_device_transfer_page_pending_request_title",
  DESCRIPTION: "webapp_device_transfer_page_pending_request_description",
  REJECT_BUTTON: "webapp_device_transfer_page_pending_request_reject_button",
  CONFIRM_BUTTON: "webapp_device_transfer_page_pending_request_confirm_button",
  ADDITIONAL_SECURITY_INFO:
    "webapp_device_transfer_page_pending_request_additional_infobox",
};
export const DeviceTransferRequestPending = ({
  untrustedDeviceName,
  requestTimestamp,
  untrustedDeviceLocation,
}: Props) => {
  const { translate } = useTranslate();
  const { approveRequest, rejectRequest } = useModuleCommands(
    DeviceTransferContracts.deviceTransferApi
  );
  const logAddNewDevice = (action: ActionDuringTransfer) => {
    void logEvent(
      new UserAddNewDeviceEvent({
        action,
      })
    );
  };
  const onRejectRequest = () => {
    rejectRequest();
    logAddNewDevice(ActionDuringTransfer.RejectRequest);
  };
  const onApproveRequest = () => {
    approveRequest();
    logAddNewDevice(ActionDuringTransfer.ConfirmRequest);
  };
  return (
    <>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      <Flex
        sx={{
          flexDirection: "column",
          bg: "ds.container.agnostic.neutral.quiet",
          borderRadius: "8px",
          padding: "24px",
          margin: "32px 0",
        }}
      >
        <Paragraph>{untrustedDeviceName}</Paragraph>
        <Paragraph sx={{ margin: "12px 0" }}>
          {untrustedDeviceLocation}
        </Paragraph>
        <Paragraph>
          {translate.shortDate(
            fromUnixTime(requestTimestamp),
            LocaleFormat.lll
          )}
        </Paragraph>
      </Flex>
      <Infobox
        title={translate(I18N_KEYS.ADDITIONAL_SECURITY_INFO)}
        mood="brand"
        sx={{ marginBottom: "24px" }}
      />
      <Flex justifyContent="right" gap="8px">
        <Button
          mood="neutral"
          intensity="quiet"
          onClick={() => onRejectRequest()}
        >
          {translate(I18N_KEYS.REJECT_BUTTON)}
        </Button>
        <Button onClick={() => onApproveRequest()}>
          {translate(I18N_KEYS.CONFIRM_BUTTON)}
        </Button>
      </Flex>
    </>
  );
};
