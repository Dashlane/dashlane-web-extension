import { fromUnixTime } from "date-fns";
import { Flex } from "@dashlane/design-system";
import { colors, Paragraph } from "@dashlane/ui-components";
import { RenderPlatformIcon } from "../platform-icon/render-platform-icon";
import LocalizedTimeAgo from "../../libs/i18n/localizedTimeAgo";
import { DeviceToDeactivateInfoView } from "@dashlane/communication";
const I18N_KEYS = {
  DEVICE_INFO_LAST_ACTIVE:
    "webapp_login_one_device_limit_device_info_last_active",
};
interface DeviceToDeactivateInfoProps {
  checked: boolean;
  deviceToDeactivate: DeviceToDeactivateInfoView;
  handleOnSelection: (device: DeviceToDeactivateInfoView) => void;
}
export const DeviceToDeactivateInfo = ({
  deviceToDeactivate,
  handleOnSelection,
  checked,
}: DeviceToDeactivateInfoProps) => {
  if (deviceToDeactivate?.isCurrentDevice) {
    return null;
  }
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
        backgroundColor: checked ? colors.dashGreen06 : colors.white,
        "&:hover": {
          backgroundColor: colors.dashGreen06,
        },
      }}
    >
      <input
        type="checkbox"
        id={deviceToDeactivate.deviceId}
        name={deviceToDeactivate.deviceName ?? ""}
        checked={checked}
        sx={{
          marginLeft: "23px",
        }}
        onChange={() => handleOnSelection(deviceToDeactivate)}
      />
      <label
        htmlFor={deviceToDeactivate.deviceId}
        style={{ flexGrow: 1, padding: "21px 0 21px 0" }}
      >
        <Flex alignItems="center">
          <span style={{ paddingLeft: "33px", paddingRight: "33px" }}>
            <RenderPlatformIcon platform={deviceToDeactivate.platform} />
          </span>

          <Flex
            flexDirection="column"
            sx={{
              paddingLeft: "10px",
            }}
          >
            <Paragraph
              sx={{
                fontWeight: "bolder",
              }}
            >
              {deviceToDeactivate.deviceName}
            </Paragraph>
            <Paragraph size="x-small" bold={true} color={colors.grey01}>
              <LocalizedTimeAgo
                date={fromUnixTime(deviceToDeactivate.lastActivityDate)}
                i18n={{
                  key: I18N_KEYS.DEVICE_INFO_LAST_ACTIVE,
                  param: "timeAgo",
                }}
              />
            </Paragraph>
          </Flex>
        </Flex>
      </label>
    </Flex>
  );
};
