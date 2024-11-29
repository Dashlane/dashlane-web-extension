import {
  Badge,
  ExpressiveIcon,
  Flex,
  Heading,
  Icon,
  IconProps,
  ItemHeader,
  Paragraph,
  Tooltip,
} from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import { deviceManagementApi } from "@dashlane/device-contracts";
import { Capabilities, VpnAccountStatusType } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useDarkWebMonitoringEmails } from "../../dark-web-monitoring/hooks/useDarkWebMonitoringEmails";
import { useVpnCredential } from "../../vpn";
interface Props {
  title: string;
  capabilities: Capabilities | undefined;
}
const I18N_KEYS = {
  CLOSE_ACTION_LABEL_A11Y:
    "manage_subscription_plan_loss_aversion_dialog_close_label_a11y",
  CREDS_DESC:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_creds_desc",
  CREDS_MAIN:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_creds_main",
  CREDS_RESULT:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_creds_result",
  DWM_DESC: "manage_subscription_plan_loss_aversion_dialog_losslist_dwm_desc",
  DWM_MAIN: "manage_subscription_plan_loss_aversion_dialog_losslist_dwm_main",
  DWM_RESULT:
    "manage_subscription_plan_loss_aversion_dialog_losslist_dwm_result",
  PASSWORD_LIMIT_BADGE:
    "manage_subscription_plan_loss_aversion_dialog_losslist_creds_badge",
  PASSWORD_LIMIT_TOOLTIP:
    "manage_subscription_plan_loss_aversion_dialog_losslist_creds_tooltip",
  SYNC_DESC:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_sync_desc",
  SYNC_MAIN:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_sync_main",
  SYNC_RESULT:
    "manage_subscription_plan_loss_aversion_dialog_losslist_unlimited_sync_result",
  VPN_DESC: "manage_subscription_plan_loss_aversion_dialog_losslist_vpn_desc",
  VPN_MAIN: "manage_subscription_plan_loss_aversion_dialog_losslist_vpn_main",
  VPN_RESULT:
    "manage_subscription_plan_loss_aversion_dialog_losslist_vpn_result",
};
export const FREE_USER_PASSWORD_LIMIT = 25;
export const LostFeaturesList = ({ capabilities, title }: Props) => {
  const { translate } = useTranslate();
  const credentialsCountQuery = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Credential],
  });
  const dwmEmailsData = useDarkWebMonitoringEmails();
  const vpnData = useVpnCredential();
  const authorisedDeviceList = useModuleQuery(
    deviceManagementApi,
    "listAuthorisedDevice"
  );
  if (
    dwmEmailsData.isLoading ||
    !vpnData ||
    authorisedDeviceList.status !== DataStatus.Success
  ) {
    return null;
  }
  const devicesCount = authorisedDeviceList.data.length;
  const credentialsCount =
    credentialsCountQuery.status === DataStatus.Success
      ? credentialsCountQuery.data.credentialsResult.matchCount
      : 0;
  const dwmEmailsCount = dwmEmailsData?.emails?.length ?? 0;
  const isVpnActive = vpnData?.status === VpnAccountStatusType.Activated;
  const features: Record<
    string,
    {
      iconName: IconProps["name"];
      title: string;
      desc: string | undefined;
      result: string;
      shouldBeShown: boolean;
    }
  > = {
    credentials: {
      iconName: "ItemLoginOutlined",
      title: translate(I18N_KEYS.CREDS_MAIN),
      desc: translate(I18N_KEYS.CREDS_DESC, {
        count: credentialsCount,
      }),
      result: translate(I18N_KEYS.CREDS_RESULT, {
        count: FREE_USER_PASSWORD_LIMIT,
      }),
      shouldBeShown: true,
    },
    sync: {
      iconName: "FeatureAuthenticatorOutlined",
      title: translate(I18N_KEYS.SYNC_MAIN),
      desc:
        devicesCount < 2
          ? undefined
          : translate(I18N_KEYS.SYNC_DESC, {
              count: devicesCount,
            }),
      result: translate(I18N_KEYS.SYNC_RESULT),
      shouldBeShown: !capabilities?.devicesLimit.enabled,
    },
    dwm: {
      iconName: "FeatureDarkWebMonitoringOutlined",
      title: translate(I18N_KEYS.DWM_MAIN),
      desc: translate(I18N_KEYS.DWM_DESC, {
        count: dwmEmailsCount,
      }),
      result: translate(I18N_KEYS.DWM_RESULT),
      shouldBeShown: !!capabilities?.dataLeak.enabled && dwmEmailsCount > 0,
    },
    vpn: {
      iconName: "FeatureVpnOutlined",
      title: translate(I18N_KEYS.VPN_MAIN),
      desc: translate(I18N_KEYS.VPN_DESC),
      result: translate(I18N_KEYS.VPN_RESULT),
      shouldBeShown: !!capabilities?.secureWiFi.enabled && isVpnActive,
    },
  };
  return (
    <div
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        borderRadius: "8px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.block.medium"
        sx={{ marginBottom: "24px" }}
      >
        {title}
      </Heading>
      <Flex flexDirection="column" gap="24px">
        {Object.values(features)
          .filter((feature) => feature.shouldBeShown)
          .map((feature) => {
            const { desc, iconName, title, result } = feature;
            return (
              <Flex alignItems="center" key={iconName}>
                <ItemHeader
                  thumbnail={<ExpressiveIcon name={iconName} />}
                  title={title}
                  description={desc}
                  sx={{ width: "268px" }}
                />
                <Icon
                  name="ArrowRightOutlined"
                  size="small"
                  sx={{ margin: "0px 12px" }}
                />
                <div>
                  <Paragraph color="ds.text.danger.standard" as="span">
                    {result}
                  </Paragraph>

                  {iconName === "ItemLoginOutlined" &&
                  !!capabilities?.passwordsLimit &&
                  credentialsCount > FREE_USER_PASSWORD_LIMIT ? (
                    <Tooltip
                      content={translate(I18N_KEYS.PASSWORD_LIMIT_TOOLTIP)}
                    >
                      <Badge
                        label={translate(I18N_KEYS.PASSWORD_LIMIT_BADGE)}
                        iconName="FeedbackInfoOutlined"
                        mood="danger"
                        layout="iconLeading"
                        sx={{ marginTop: "4px" }}
                      />
                    </Tooltip>
                  ) : null}
                </div>
              </Flex>
            );
          })}
      </Flex>
    </div>
  );
};
