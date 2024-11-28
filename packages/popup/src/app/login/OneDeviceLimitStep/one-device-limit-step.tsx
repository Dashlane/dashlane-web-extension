import * as React from "react";
import { PreviousDeviceInfo } from "@dashlane/communication";
import { Button, Flex } from "@dashlane/design-system";
import {
  BackIcon,
  Heading,
  jsx,
  Link,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { getUrlGivenQuery } from "../../../libs/getUrlGivenQuery";
import { openExternalUrl, PRICING_PAGE_URL } from "../../../libs/externalUrls";
import { DeviceLimitFlowAnimation } from "../DeviceLimitFlow/device-limit-flow-animation";
import UnlinkPreviousDeviceStep from "./unlink-previous-device";
import { useOneDeviceLimitReachedStage } from "./use-one-device-limit-reached-stage";
import styles from "./styles.css";
const I18N_KEYS = {
  DESCRIPTION: "login/one_device_limit_description_upgrade",
  SEE_PREMIUM_PLAN: "login/one_device_limit_see_premium_plan",
  TITLE: "login/one_device_limit_header",
  UNLINK_PREVIOUS_DEVICE: "login/one_device_limit_unlink_previous_device",
  TITLE_V2: "login/one_device_limit_header_v2",
  DESCRIPTION_V2: "login/one_device_limit_description_upgrade_v2",
  START_TRANSFER: "login/one_device_limit_start_transfer",
};
interface OneDeviceLimitStepProps {
  previousDevice: PreviousDeviceInfo;
  onStartOver: () => void;
}
const OneDeviceLimitStepComponent = (props: OneDeviceLimitStepProps) => {
  const { translate, translateMarkup } = useTranslate();
  const [showUnlinkPreviousDeviceStep, setShowUnlinkPreviousDeviceStep] =
    React.useState(false);
  const stage = useOneDeviceLimitReachedStage();
  const onUpgradeToPremium2 = (): void => {
    void openExternalUrl(
      getUrlGivenQuery(PRICING_PAGE_URL, {
        page: "personal",
        currentPlan: "free",
        variant: "devices",
      })
    );
  };
  const onUnlinkPreviousDevice = () => {
    void stage.unlinkPreviousDevice();
  };
  const onStartOver = () => {
    props.onStartOver();
  };
  const onShowUnlinkPreviousDevice = () => {
    setShowUnlinkPreviousDeviceStep(true);
  };
  return showUnlinkPreviousDeviceStep ? (
    <UnlinkPreviousDeviceStep
      previousDeviceInfo={props.previousDevice}
      onCancel={onStartOver}
      onUnlinkPreviousDevice={onUnlinkPreviousDevice}
    />
  ) : (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      alignItems="stretch"
      sx={{
        backgroundColor: "ds.background.default",
        height: "100%",
        padding: "24px",
      }}
    >
      <Link onClick={onStartOver}>
        <BackIcon size={20} color={"ds.text.brand.standard"} />
      </Link>
      <DeviceLimitFlowAnimation
        containerClassName={styles.animationContainer}
        loop={true}
      />
      <Heading
        size="small"
        sx={{
          padding: "0 6px",
          textAlign: "center",
          color: "ds.text.neutral.catchy",
          marginBottom: "16px",
        }}
      >
        {translate(I18N_KEYS.TITLE_V2)}
      </Heading>
      <Paragraph
        as={Paragraph}
        size="large"
        sx={{
          padding: "0 6px",
          color: "ds.text.neutral.quiet",
          textAlign: "center",
          strong: {
            fontWeight: "bold",
          },
          flex: 1,
        }}
      >
        {translateMarkup(I18N_KEYS.DESCRIPTION_V2)}
      </Paragraph>
      <Button
        fullsize
        onClick={onUpgradeToPremium2}
        mood="brand"
        size="large"
        sx={{
          marginBottom: "16px",
        }}
      >
        {translate(I18N_KEYS.SEE_PREMIUM_PLAN)}
      </Button>
      <Button
        fullsize
        onClick={onShowUnlinkPreviousDevice}
        mood="neutral"
        intensity="quiet"
        size="large"
      >
        {translate(I18N_KEYS.START_TRANSFER)}
      </Button>
    </Flex>
  );
};
export const OneDeviceLimitStep = React.memo(OneDeviceLimitStepComponent);
