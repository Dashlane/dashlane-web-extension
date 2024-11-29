import {
  Badge,
  Button,
  Card,
  ExpressiveIcon,
  Flex,
  Heading,
  IconName,
  Paragraph,
} from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHistory, useRouteMatch } from "../../../libs/router";
export const I18N_KEYS = {
  SCIM_CARD_OPTION: "tac_settings_directory_sync_card_option",
  SCIM_CARD_BADGE_ENABLED: "tac_settings_directory_sync_card_badge_enabled",
  FEATURE_CARD_BADGE_CONFIGURATION_NOT_COMPLETED:
    "tac_settings_feature_card_badge_configuration_not_completed",
  BADGE_BUSINESS_PLAN: "team_settings_sso_paywall_business_badge",
};
export type FeatureCardStatus = "NOT_STARTED" | "STARTED" | "ACTIVATED";
interface FeatureCardItemProps {
  title: string;
  iconName: IconName;
  description?: string;
  isSupported?: boolean;
  disabled: boolean;
}
export interface FeatureCardProps {
  title: string;
  redirectUrl: string;
  optionNumber?: number;
  disabled?: boolean;
  selected?: boolean;
  supportedFeatures: Omit<FeatureCardItemProps, "disabled">[];
  onCtaClick?: () => void;
  buttonLabel: string;
  featureCardStatus: FeatureCardStatus;
  ctaDataTestId?: string;
  setBusinessPlanBadge?: boolean;
}
export type FeatureCardDescriberProps = Omit<
  FeatureCardProps,
  "optionNumber" | "buttonLabel" | "featureCardStatus"
>;
const FeatureCardItem = ({
  title,
  description,
  isSupported,
  iconName,
  disabled = false,
}: FeatureCardItemProps) => {
  const { translate } = useTranslate();
  return (
    <Flex gap="8px" flexWrap="nowrap" alignItems="flex-start">
      <ExpressiveIcon
        name={iconName}
        mood={disabled ? "neutral" : isSupported === false ? "danger" : "brand"}
      />
      <Flex flexDirection="column" gap="4px">
        <Paragraph
          textStyle="ds.body.standard.regular"
          color={
            disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.catchy"
          }
        >
          {translate(title)}
        </Paragraph>
        {description ? (
          <Paragraph
            textStyle="ds.body.helper.regular"
            color={
              disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.quiet"
            }
          >
            {translate(description)}
          </Paragraph>
        ) : null}
      </Flex>
    </Flex>
  );
};
export const FeatureCard = ({
  title,
  redirectUrl,
  optionNumber,
  supportedFeatures,
  buttonLabel: buttonTranscriptionKey,
  onCtaClick,
  disabled = false,
  selected = false,
  featureCardStatus = "NOT_STARTED",
  ctaDataTestId,
  setBusinessPlanBadge = false,
}: FeatureCardProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const match = useRouteMatch();
  const url = `${match.path}/${redirectUrl}`;
  const onSetupClick = () => {
    onCtaClick?.();
    history.push(url);
  };
  return (
    <Card
      sx={{
        borderColor: selected
          ? "ds.border.brand.standard.idle"
          : "ds.border.neutral.quiet.idle",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        width: "100%",
      }}
    >
      <GridContainer gridTemplateAreas="'business business' 'option badge' 'title title' 'body body' 'button button'">
        {setBusinessPlanBadge ? (
          <GridChild gridArea="business" sx={{ marginBottom: "8px" }}>
            <Badge
              iconName="PremiumOutlined"
              layout="iconLeading"
              label={translate(I18N_KEYS.BADGE_BUSINESS_PLAN)}
              mood="brand"
              intensity="quiet"
            />
          </GridChild>
        ) : null}
        {optionNumber && (
          <GridChild gridArea="option" sx={{ marginBottom: "8px" }}>
            <Paragraph
              color={
                disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.quiet"
              }
              textStyle="ds.body.helper.regular"
            >
              {`${translate(I18N_KEYS.SCIM_CARD_OPTION)} ${optionNumber}`}
            </Paragraph>
          </GridChild>
        )}
        {featureCardStatus === "ACTIVATED" ||
        featureCardStatus === "STARTED" ? (
          <GridChild gridArea="badge" justifySelf="right">
            <Badge
              mood={featureCardStatus === "ACTIVATED" ? "positive" : "warning"}
              intensity="catchy"
              label={
                featureCardStatus === "ACTIVATED"
                  ? translate(I18N_KEYS.SCIM_CARD_BADGE_ENABLED)
                  : translate(
                      I18N_KEYS.FEATURE_CARD_BADGE_CONFIGURATION_NOT_COMPLETED
                    )
              }
            />
          </GridChild>
        ) : null}
        <GridChild gridArea="title" sx={{ marginBottom: "32px" }}>
          <Heading
            as="h3"
            textStyle="ds.title.section.medium"
            color={
              disabled ? "ds.text.oddity.disabled" : "ds.text.neutral.catchy"
            }
            sx={{ display: "inline-block" }}
          >
            {translate(title)}
          </Heading>
        </GridChild>
        <GridChild gridArea="body">
          <Flex gap="32px" flexDirection="column" sx={{ marginBottom: "32px" }}>
            {supportedFeatures.map((feat) => (
              <FeatureCardItem
                key={optionNumber + feat.title}
                disabled={disabled}
                {...feat}
              />
            ))}
          </Flex>
        </GridChild>
        <GridChild gridArea="button" justifySelf="right">
          {setBusinessPlanBadge ? (
            <Button
              role="button"
              onClick={() => onCtaClick?.()}
              disabled={disabled}
              intensity="catchy"
              layout="iconLeading"
              icon="PremiumOutlined"
            >
              {buttonTranscriptionKey}
            </Button>
          ) : (
            <Button
              role="button"
              onClick={onSetupClick}
              disabled={disabled}
              intensity="catchy"
              data-testid={ctaDataTestId}
            >
              {buttonTranscriptionKey}
            </Button>
          )}
        </GridChild>
      </GridContainer>
    </Card>
  );
};
