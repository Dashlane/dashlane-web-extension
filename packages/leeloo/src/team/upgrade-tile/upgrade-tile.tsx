import { PropsWithChildren } from 'react';
import { Button, Heading, Icon, IconProps, jsx, Paragraph, } from '@dashlane/design-system';
import { Button as ButtonType, ClickOrigin, UserClickEvent, } from '@dashlane/hermes';
import { FlexContainer, LoadingIcon } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { UserMessageTypes } from '@dashlane/communication';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory } from 'libs/router';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { openUrl } from 'libs/external-urls';
import { logEvent } from 'libs/logs/logEvent';
import { useUserMessages } from 'libs/user-messages/useUserMessages';
import { isTeamTier } from 'libs/account/helpers';
import { dismissUserMessage } from 'libs/user-messages';
import { useDiscontinuedStatus } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useTeamTrialStatus } from 'libs/hooks/use-team-trial-status';
import { LimitedPriceInfobox } from 'team/limited-business-offer/limited-price-infobox';
import { useUpgradeData } from './use-upgrade-data';
export interface UseShowUpgradeTileProps {
    dismissible?: boolean;
}
export const useShowUpgradeTile = ({ dismissible, }: UseShowUpgradeTileProps) => {
    const messages = useUserMessages();
    const teamTrialStatus = useTeamTrialStatus();
    const discontinuedStatus = useDiscontinuedStatus();
    const hasEcommDiscontinuationFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    if (!teamTrialStatus || discontinuedStatus.isLoading) {
        return false;
    }
    const isTrial = teamTrialStatus.isFreeTrial;
    const isBusiness = teamTrialStatus.spaceTier === SpaceTier.Business;
    if (isBusiness && !isTrial) {
        return false;
    }
    const { isTeamSoftDiscontinued, isTrial: nodePremiumStatusIsTrial } = discontinuedStatus;
    if (isTeamSoftDiscontinued &&
        nodePremiumStatusIsTrial &&
        !!hasEcommDiscontinuationFF) {
        return false;
    }
    const hasDismissedUpgradeMessage = messages.find((message) => message.type === UserMessageTypes.DASHBOARD_UPRADE && message.dismissedAt);
    return !dismissible || !hasDismissedUpgradeMessage;
};
export type FeatureRowProps = PropsWithChildren<{
    iconName: IconProps['name'];
}>;
const FeatureRow = ({ iconName, children }: FeatureRowProps) => (<FlexContainer flexDirection="row" gap="12px" alignItems="center" flexWrap="nowrap">
    <div sx={{
        padding: '8px',
        backgroundColor: 'ds.container.expressive.brand.quiet.idle',
        borderRadius: '8px',
    }}>
      <Icon name={iconName} size="large" color="ds.text.brand.standard"/>
    </div>
    <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy">
      {children}
    </Paragraph>
  </FlexContainer>);
interface UpgradeTileProps {
    dismissible?: boolean;
}
export const UpgradeTile = ({ dismissible }: UpgradeTileProps) => {
    const { translate } = useTranslate();
    const upgradeData = useUpgradeData();
    const premiumStatus = usePremiumStatus();
    const history = useHistory();
    const handleClickOnUpgrade = () => {
        if (!upgradeData) {
            return;
        }
        if (upgradeData.cta.external) {
            openUrl(upgradeData.cta.link);
        }
        else {
            history.push(upgradeData.cta.link);
        }
        logEvent(new UserClickEvent({
            button: ButtonType.BuyDashlane,
            clickOrigin: ClickOrigin.FeatureLimitationsBlock,
        }));
    };
    const hasCtaToBusiness = premiumStatus.status === DataStatus.Success &&
        isTeamTier(premiumStatus.data);
    if (!upgradeData) {
        return <LoadingIcon size="24px" color="ds.text.neutral.catchy"/>;
    }
    return (<FlexContainer flexDirection="column" gap="24px">
      <FlexContainer flexDirection="column" gap="8px">
        <FlexContainer alignItems="start" flexWrap="nowrap" justifyContent="space-between">
          <Heading as="h5" textStyle="ds.title.block.medium" color="ds.text.neutral.catchy">
            {upgradeData.header.key.includes('markup')
            ? translate.markup(upgradeData.header.key, upgradeData.header.variables)
            : translate(upgradeData.header.key, upgradeData.header.variables)}
          </Heading>
          {dismissible ? (<Button sx={{ padding: '4px' }} mood="neutral" intensity="supershy" size="medium" layout="iconOnly" onClick={() => dismissUserMessage({
                type: UserMessageTypes.DASHBOARD_UPRADE,
            })} icon={<Icon color="ds.text.neutral.quiet" name="ActionCloseOutlined"/>}/>) : null}
        </FlexContainer>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
          {translate(upgradeData.description.key)}
        </Paragraph>
      </FlexContainer>
      {upgradeData.features.map((feature) => (<FeatureRow key={feature.key} iconName={feature.iconName}>
          {feature.key.includes('markup')
                ? translate.markup(feature.key)
                : translate(feature.key)}
        </FeatureRow>))}
      {hasCtaToBusiness ? <LimitedPriceInfobox /> : null}
      <Button fullsize mood={dismissible ? 'brand' : 'neutral'} intensity={dismissible ? 'catchy' : 'quiet'} key={upgradeData.cta.key} onClick={handleClickOnUpgrade}>
        {translate(upgradeData.cta.key)}
      </Button>
    </FlexContainer>);
};
