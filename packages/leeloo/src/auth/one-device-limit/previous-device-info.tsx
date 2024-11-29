import { useEffect } from "react";
import { fromUnixTime } from "date-fns";
import { Flex } from "@dashlane/design-system";
import { PreviousDeviceInfo as PreviousDeviceInfoData } from "@dashlane/communication";
import { colors, Paragraph } from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { logPageView } from "../../libs/logs/logEvent";
import LocalizedTimeAgo from "../../libs/i18n/localizedTimeAgo";
import { RenderPlatformIcon } from "../platform-icon/render-platform-icon";
export interface PreviousDeviceInfoProps {
  previousDeviceInfo: PreviousDeviceInfoData;
}
const I18N_KEYS = {
  DEVICE_INFO_LAST_ACTIVE:
    "webapp_login_one_device_limit_device_info_last_active",
};
export const PreviousDeviceInfo = (props: PreviousDeviceInfoProps) => {
  const { previousDeviceInfo } = props;
  useEffect(() => {
    logPageView(PageView.PaywallDeviceSyncLimitUnlinkDevice);
  }, []);
  return (
    <Flex
      alignItems="center"
      sx={{
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: colors.grey05,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: colors.grey05,
        height: "80px",
      }}
    >
      <RenderPlatformIcon platform={previousDeviceInfo.platform} />
      <Flex
        flexDirection="column"
        sx={{
          marginLeft: "10px",
        }}
      >
        <Paragraph
          sx={{
            fontWeight: "bolder",
          }}
        >
          {previousDeviceInfo.name}
        </Paragraph>
        <Paragraph size="x-small" bold={true} color={colors.grey01}>
          <LocalizedTimeAgo
            date={fromUnixTime(previousDeviceInfo.lastActive)}
            i18n={{
              key: I18N_KEYS.DEVICE_INFO_LAST_ACTIVE,
              param: "timeAgo",
            }}
          />
        </Paragraph>
      </Flex>
    </Flex>
  );
};
