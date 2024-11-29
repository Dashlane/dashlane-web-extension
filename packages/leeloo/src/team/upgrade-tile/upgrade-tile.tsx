import { PropsWithChildren } from "react";
import {
  Badge,
  Button,
  Flex,
  Heading,
  Icon,
  IconProps,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import image from "@dashlane/design-system/assets/illustrations/SCIM-SSO-integration-easy-for-businessess@2x-light.webp";
import {
  Button as ButtonType,
  ClickOrigin,
  UserClickEvent,
} from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { UserMessageTypes } from "@dashlane/communication";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import { useHistory } from "../../libs/router";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import { openUrl } from "../../libs/external-urls";
import { logEvent } from "../../libs/logs/logEvent";
import { useUserMessages } from "../../libs/user-messages/useUserMessages";
import { isStarterTier, isTeamTier } from "../../libs/account/helpers";
import { dismissUserMessage } from "../../libs/user-messages";
import { useDiscontinuedStatus } from "../../libs/carbon/hooks/useNodePremiumStatus";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { LimitedPriceInfobox } from "../limited-business-offer/limited-price-infobox";
import { useUpgradeData } from "./use-upgrade-data";
import { HeadingLevel } from "../types";
import { useIsStandard } from "../helpers/use-is-standard";
import { FeatureLine } from "../account/page-side-content/upgrade-content/feature-line";
export interface UseShowUpgradeTileProps {
  dismissible?: boolean;
}
export const useShowUpgradeTile = ({
  dismissible,
}: UseShowUpgradeTileProps) => {
  const messages = useUserMessages();
  const teamTrialStatus = useTeamTrialStatus();
  const discontinuedStatus = useDiscontinuedStatus();
  if (!teamTrialStatus || discontinuedStatus.isLoading) {
    return false;
  }
  const isTrial = teamTrialStatus.isFreeTrial;
  const isBusiness =
    teamTrialStatus.spaceTier === SpaceTier.Business ||
    teamTrialStatus.spaceTier === SpaceTier.BusinessPlus;
  if (isBusiness && !isTrial) {
    return false;
  }
  const hasDismissedUpgradeMessage = messages.find(
    (message) =>
      message.type === UserMessageTypes.DASHBOARD_UPRADE && message.dismissedAt
  );
  return !dismissible || !hasDismissedUpgradeMessage;
};
export type FeatureRowProps = PropsWithChildren<{
  iconName: IconProps["name"];
}>;
export const FeatureRow = ({ iconName, children }: FeatureRowProps) => (
  <Flex gap="12px" alignItems="center" flexWrap="nowrap">
    <div
      sx={{
        padding: "8px",
        backgroundColor: "ds.container.expressive.brand.quiet.idle",
        borderRadius: "8px",
      }}
    >
      <Icon name={iconName} size="large" color="ds.text.brand.standard" />
    </div>
    <Paragraph
      textStyle="ds.body.standard.regular"
      color="ds.text.neutral.catchy"
    >
      {children}
    </Paragraph>
  </Flex>
);
interface UpgradeTileProps {
  dismissible?: boolean;
  headingLevel?: HeadingLevel;
}
export const UpgradeTile = ({
  dismissible,
  headingLevel = "h5",
}: UpgradeTileProps) => {
  const { translate } = useTranslate();
  const upgradeData = useUpgradeData();
  const premiumStatus = usePremiumStatus();
  const history = useHistory();
  const isStandardPlan = useIsStandard();
  const handleClickOnUpgrade = () => {
    if (!upgradeData) {
      return;
    }
    if (upgradeData.cta.external) {
      openUrl(upgradeData.cta.link);
    } else {
      history.push(upgradeData.cta.link);
    }
    logEvent(
      new UserClickEvent({
        button: ButtonType.BuyDashlane,
        clickOrigin: ClickOrigin.FeatureLimitationsBlock,
      })
    );
  };
  const hasCtaToBusiness =
    premiumStatus.status === DataStatus.Success &&
    isTeamTier(premiumStatus.data);
  const isStarter =
    premiumStatus.status === DataStatus.Success &&
    isStarterTier(premiumStatus.data);
  if (!upgradeData) {
    return <IndeterminateLoader size="large" mood="neutral" />;
  }
  return (
    <Flex flexDirection="column" gap="24px">
      {isStandardPlan ? (
        <>
          <Flex flexDirection="column" gap="8px">
            <Flex
              alignItems="start"
              flexWrap="nowrap"
              justifyContent="space-between"
              flexDirection="column"
              gap="16px"
            >
              <Badge
                label={translate(upgradeData.header.key)}
                mood="brand"
                iconName="PremiumOutlined"
                layout="iconLeading"
              />
              <div sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
                <img
                  role="presentation"
                  alt=""
                  src={image}
                  sx={{ objectFit: "contain", width: "100%", height: "auto" }}
                />
              </div>
            </Flex>
            <Paragraph
              textStyle="ds.title.block.medium"
              color="ds.text.neutral.catchy"
            >
              {translate(upgradeData.description.key)}
            </Paragraph>
          </Flex>
          {upgradeData.features.map((feature) => (
            <FeatureLine
              key={feature.key}
              iconName={feature.iconName}
              description={feature.key}
            />
          ))}
          <Button
            mood="brand"
            intensity="catchy"
            key={upgradeData.cta.key}
            onClick={handleClickOnUpgrade}
            layout="iconLeading"
            icon="PremiumOutlined"
          >
            {translate(upgradeData.cta.key)}
          </Button>
        </>
      ) : (
        <>
          <Flex flexDirection="column" gap="8px">
            <Flex
              alignItems="start"
              flexWrap="nowrap"
              justifyContent="space-between"
            >
              <Heading
                as={headingLevel}
                textStyle="ds.title.block.medium"
                color="ds.text.neutral.catchy"
              >
                {upgradeData.header.key.includes("markup")
                  ? translate.markup(
                      upgradeData.header.key,
                      upgradeData.header.variables
                    )
                  : translate(
                      upgradeData.header.key,
                      upgradeData.header.variables
                    )}
              </Heading>
              {dismissible ? (
                <Button
                  sx={{ padding: "4px" }}
                  mood="neutral"
                  intensity="supershy"
                  size="medium"
                  layout="iconOnly"
                  onClick={() =>
                    dismissUserMessage({
                      type: UserMessageTypes.DASHBOARD_UPRADE,
                    })
                  }
                  icon={
                    <Icon
                      color="ds.text.neutral.quiet"
                      name="ActionCloseOutlined"
                    />
                  }
                />
              ) : null}
            </Flex>
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.quiet"
            >
              {translate(upgradeData.description.key)}
            </Paragraph>
          </Flex>
          {upgradeData.features.map((feature) => (
            <FeatureRow key={feature.key} iconName={feature.iconName}>
              {feature.key.includes("markup")
                ? translate.markup(feature.key)
                : translate(feature.key)}
            </FeatureRow>
          ))}
          {hasCtaToBusiness ? <LimitedPriceInfobox /> : null}
          <Button
            fullsize
            mood={dismissible ? "brand" : "neutral"}
            intensity={dismissible ? "catchy" : "quiet"}
            key={upgradeData.cta.key}
            onClick={handleClickOnUpgrade}
            layout={isStarter ? "iconLeading" : undefined}
            icon={isStarter ? "PremiumOutlined" : undefined}
          >
            {translate(upgradeData.cta.key)}
          </Button>
        </>
      )}
    </Flex>
  );
};
