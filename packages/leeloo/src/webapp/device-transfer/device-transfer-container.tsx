import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { Flex, Heading } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { DeviceTransferInstructions } from "./components/device-transfer-add-new-device-instruction";
import { DeviceTransferComplete } from "./components/device-transfer-complete";
import { DeviceTransferError } from "./components/device-transfer-error";
import { DeviceTransferLoading } from "./components/device-transfer-loading";
import { DeviceTransferRejected } from "./components/device-transfer-rejected";
import { DeviceTransferRequestPending } from "./components/device-transfer-request-pending";
import { DeviceTransferSecurityChallenge } from "./components/device-transfer-security-challenge";
const I18N_KEYS = {
  DEVICE_TRANSFER_TITLE: "webapp_device_transfer_page_title",
};
export const DeviceTransferContainer = () => {
  const { translate } = useTranslate();
  const deviceTransferFlowStatus = useModuleQuery(
    DeviceTransferContracts.deviceTransferApi,
    "trustedDeviceFlowStatus"
  );
  const getDeviceTransferComponent = () => {
    switch (deviceTransferFlowStatus.data?.step) {
      case DeviceTransferContracts.TrustedDeviceFlowStep
        .WaitingForNewDeviceRequest:
        return <DeviceTransferInstructions />;
      case DeviceTransferContracts.TrustedDeviceFlowStep
        .NewDeviceRequestAvailable:
        return (
          <DeviceTransferRequestPending {...deviceTransferFlowStatus.data} />
        );
      case DeviceTransferContracts.TrustedDeviceFlowStep.LoadingChallenge:
        return <DeviceTransferLoading />;
      case DeviceTransferContracts.TrustedDeviceFlowStep
        .DisplayPassphraseChallenge:
        return (
          <DeviceTransferSecurityChallenge {...deviceTransferFlowStatus.data} />
        );
      case DeviceTransferContracts.TrustedDeviceFlowStep.DeviceTransferComplete:
        return <DeviceTransferComplete {...deviceTransferFlowStatus.data} />;
      case DeviceTransferContracts.TrustedDeviceFlowStep.DeviceTransferRejected:
        return <DeviceTransferRejected {...deviceTransferFlowStatus.data} />;
      case DeviceTransferContracts.TrustedDeviceFlowStep.Error:
        return (
          <DeviceTransferError
            error={deviceTransferFlowStatus.data.errorCode}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
      sx={{
        height: "100%",
        bg: "ds.container.agnostic.neutral.quiet",
        paddingTop: "16px",
      }}
    >
      <Flex sx={{ paddingLeft: "32px", paddingRight: "32px" }}>
        <Header
          startWidgets={
            <Flex flexDirection="column">
              <Heading as="h1" textStyle="ds.title.section.large">
                {translate(I18N_KEYS.DEVICE_TRANSFER_TITLE)}
              </Heading>
            </Flex>
          }
          endWidget={
            <>
              <HeaderAccountMenu />
              <NotificationsDropdown />
            </>
          }
        />
        <Flex
          sx={{
            width: "640px",
            maxWidth: "",
            flexDirection: "column",
            bg: "ds.container.agnostic.neutral.supershy",
            border: "1px solid transparent",
            borderColor: "ds.border.neutral.quiet.idle",
            borderRadius: "8px",
            padding: "24px",
            margin: "16px 0px",
          }}
        >
          {getDeviceTransferComponent()}
        </Flex>
      </Flex>
    </div>
  );
};
