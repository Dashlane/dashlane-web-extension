import { Button, Flex, Heading, Paragraph } from "@dashlane/design-system";
import {
  DarkWebSearchIcon,
  FlashingLightIcon,
  LightBulbIcon,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { FeatureOnboarding } from "../../feature-onboarding/feature-onboarding";
const I18N_KEYS = {
  SURVEILLANCE_TITLE: "webapp_darkweb_onboarding_surveillance_title",
  SURVEILLANCE_DESCRIPTION:
    "webapp_darkweb_onboarding_surveillance_description",
  ALERTS_TITLE: "webapp_darkweb_onboarding_alerts_title",
  ALERTS_DESCRIPTION: "webapp_darkweb_onboarding_alerts_description",
  ADVICE_TITLE: "webapp_darkweb_onboarding_advice_title",
  ADVICE_DESCRIPTION: "webapp_darkweb_onboarding_advice_description",
  PREMIUM_CTA: "webapp_darkweb_onboarding_premium_cta",
  PREMIUM_TITLE: "webapp_darkweb_onboarding_premium_title",
  TITLE: "webapp_darkweb_onboarding_title",
  DESCRIPTION: "webapp_darkweb_onboarding_description",
};
export interface OnboardingInfosProps {
  onActionClick: () => void;
}
export const OnboardingInfos = ({ onActionClick }: OnboardingInfosProps) => {
  const { translate } = useTranslate();
  const actions = (
    <div
      sx={{ display: "flex", justifyContent: "flex-end", marginTop: " 36px" }}
    >
      <Button type="button" mood="brand" onClick={onActionClick}>
        {translate(I18N_KEYS.PREMIUM_CTA)}
      </Button>
    </div>
  );
  return (
    <FeatureOnboarding
      contentTitle={translate(I18N_KEYS.PREMIUM_TITLE)}
      contentSubtitle={translate(I18N_KEYS.DESCRIPTION)}
      actions={actions}
    >
      <ul sx={{ marginTop: "8px" }}>
        <li sx={{ marginTop: "16px" }}>
          <Flex
            alignItems="center"
            justifyContent="space-around"
            flexWrap="nowrap"
            gap={6}
          >
            <div>
              <DarkWebSearchIcon
                aria-hidden
                size={35}
                color="ds.text.neutral.quiet"
              />
            </div>
            <div>
              <Heading
                as="h3"
                textStyle="ds.title.block.medium"
                sx={{ fontWeight: "bold" }}
              >
                {translate(I18N_KEYS.SURVEILLANCE_TITLE)}
              </Heading>
              <Paragraph color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.SURVEILLANCE_DESCRIPTION)}
              </Paragraph>
            </div>
          </Flex>
        </li>
        <li sx={{ marginTop: "16px" }}>
          <Flex
            alignItems="center"
            justifyContent="space-around"
            flexWrap="nowrap"
            gap={6}
          >
            <div>
              <FlashingLightIcon
                aria-hidden
                size={35}
                color="ds.text.neutral.quiet"
              />
            </div>
            <div>
              <Heading
                as="h3"
                textStyle="ds.title.block.medium"
                sx={{ fontWeight: "bold" }}
              >
                {translate(I18N_KEYS.ALERTS_TITLE)}
              </Heading>
              <Paragraph color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.ALERTS_DESCRIPTION)}
              </Paragraph>
            </div>
          </Flex>
        </li>
        <li sx={{ marginTop: "16px" }}>
          <Flex
            alignItems="center"
            justifyContent="space-around"
            flexWrap="nowrap"
            gap={6}
          >
            <div>
              <LightBulbIcon
                aria-hidden
                size={35}
                color="ds.text.neutral.quiet"
              />
            </div>
            <div>
              <Heading
                as="h3"
                textStyle="ds.title.block.medium"
                sx={{ fontWeight: "bold" }}
              >
                {translate(I18N_KEYS.ADVICE_TITLE)}
              </Heading>
              <Paragraph color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.ADVICE_DESCRIPTION)}
              </Paragraph>
            </div>
          </Flex>
        </li>
      </ul>
    </FeatureOnboarding>
  );
};
