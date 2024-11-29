import { useEffect } from "react";
import { WebOnboardingLeelooStep } from "@dashlane/communication";
import { Button, Icon, Paragraph } from "@dashlane/design-system";
import { cookieRemoveByDomain } from "@dashlane/framework-infra/spi";
import { useFeatureFlip } from "@dashlane/framework-react";
import { PageView } from "@dashlane/hermes";
import { AvailableFeatureFlips } from "@dashlane/onboarding-contracts";
import { tabsCreate } from "@dashlane/webextensions-apis";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { Link } from "../../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import { CONFIRM_SITE_STYLES } from "./confirm-site.styles";
import { setOnboardingMode } from "../../../services";
export interface Props {
  domainText: string;
  loginUrlText: string;
  setSelectedSite: (newValue: boolean) => void;
}
const I18N_KEYS = {
  WEB_ONBOARDING_CARD_ADD_PASSWORD: "web_onboarding_card_add_password",
  WEB_ONBOARDING_CARD_TITLE: "web_onboarding_card_go_to_site_title",
  WEB_ONBOARDING_CARD_DESCRIPTION: "web_onboarding_card_go_to_site_description",
  WEB_ONBOARDING_CARD_STEP_ONE_PT_ONE:
    "web_onboarding_card_go_to_site_step_1_pt_1",
  WEB_ONBOARDING_CARD_STEP_ONE_PT_TWO:
    "web_onboarding_card_go_to_site_step_1_pt_2_markup",
  WEB_ONBOARDING_CARD_STEP_TWO: "web_onboarding_card_go_to_site_step_2",
  WEB_ONBOARDING_CARD_STEP_THREE:
    "web_onboarding_card_go_to_site_step_3_markup",
  WEB_ONBOARDING_CARD_SECONDARY_BTN: "web_onboarding_card_go_back",
  WEB_ONBOARDING_CARD_PRIMARY_BTN: "web_onboarding_card_go_to_site_link",
};
export const ConfirmSite = ({
  domainText,
  loginUrlText,
  setSelectedSite,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const hasConfirmOnboardingSiteFF = useFeatureFlip(
    AvailableFeatureFlips.OnboardingWebConfirmSite
  );
  const openChosenSite = async () => {
    if (hasConfirmOnboardingSiteFF) {
      try {
        await cookieRemoveByDomain(domainText);
        await tabsCreate({ url: loginUrlText });
      } catch (error) {
        console.error("Error", error);
      }
    }
    setOnboardingMode({
      activeOnboardingType: "saveWeb",
      ...(!hasConfirmOnboardingSiteFF && {
        flowLoginCredentialOnWebSite: {
          domain: domainText,
          url: loginUrlText,
        },
      }),
    });
  };
  const goToPreviousView = () => {
    setOnboardingMode({
      activeOnboardingType: "saveWeb",
      leelooStep: WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
    });
    setSelectedSite(false);
  };
  useEffect(() => {
    logPageView(PageView.HomeOnboardingChecklistAddFirstLogin);
  }, []);
  return (
    <>
      <div
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          as={Link}
          icon="ArrowLeftOutlined"
          intensity="supershy"
          layout="iconOnly"
          mood="brand"
          size="medium"
          to={routes.userPasswordSites}
          onClick={goToPreviousView}
        />
        <div sx={{ marginLeft: "16px", display: "flex", alignItems: "center" }}>
          <Icon
            name="ItemLoginOutlined"
            size="small"
            color="ds.text.neutral.quiet"
          />
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.title.supporting.small"
            sx={{ marginLeft: "8px", marginTop: "2px" }}
          >
            {translate(I18N_KEYS.WEB_ONBOARDING_CARD_ADD_PASSWORD)}
          </Paragraph>
        </div>
      </div>

      <div sx={{ padding: "2rem 3.5rem" }}>
        <header>
          <Paragraph
            as="h2"
            color="ds.text.neutral.catchy"
            textStyle="ds.title.section.large"
          >
            {translate(I18N_KEYS.WEB_ONBOARDING_CARD_TITLE)}
          </Paragraph>
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.body.standard.regular"
            sx={{ marginTop: "8px" }}
          >
            {translate(I18N_KEYS.WEB_ONBOARDING_CARD_DESCRIPTION)}
          </Paragraph>
        </header>

        <ol sx={{ padding: "2.5rem 0 2rem" }}>
          <li sx={{ ...CONFIRM_SITE_STYLES.step, alignItems: "flex-start" }}>
            <div sx={CONFIRM_SITE_STYLES.stepMarkerContainer}>
              <Paragraph
                as="span"
                color="ds.text.neutral.catchy"
                textStyle="ds.body.standard.strong"
              >
                1
              </Paragraph>
            </div>

            <div sx={{ display: "flex", flexDirection: "column" }}>
              <Paragraph
                color="ds.text.neutral.standard"
                textStyle="ds.body.standard.regular"
              >
                {translate(I18N_KEYS.WEB_ONBOARDING_CARD_STEP_ONE_PT_ONE)}
              </Paragraph>
              <Paragraph
                color="ds.text.neutral.standard"
                textStyle="ds.body.standard.strong"
              >
                {translate.markup(
                  I18N_KEYS.WEB_ONBOARDING_CARD_STEP_ONE_PT_TWO
                )}
              </Paragraph>
            </div>
          </li>
          <li sx={CONFIRM_SITE_STYLES.step}>
            <div sx={CONFIRM_SITE_STYLES.stepMarkerContainer}>
              <Paragraph
                as="span"
                color="ds.text.neutral.catchy"
                textStyle="ds.body.standard.strong"
              >
                2
              </Paragraph>
            </div>
            <Paragraph
              color="ds.text.neutral.standard"
              textStyle="ds.body.standard.regular"
            >
              {translate(I18N_KEYS.WEB_ONBOARDING_CARD_STEP_TWO)}
            </Paragraph>
          </li>
          <li sx={CONFIRM_SITE_STYLES.step}>
            <div sx={CONFIRM_SITE_STYLES.stepMarkerContainer}>
              <Paragraph
                as="span"
                color="ds.text.neutral.catchy"
                textStyle="ds.body.standard.strong"
              >
                3
              </Paragraph>
            </div>
            <Paragraph
              color="ds.text.neutral.standard"
              textStyle="ds.body.standard.regular"
            >
              {translate.markup(I18N_KEYS.WEB_ONBOARDING_CARD_STEP_THREE)}
            </Paragraph>
          </li>
        </ol>

        <footer
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flex: "1",
            gap: "16px",
          }}
        >
          <Link to={routes.userPasswordSites}>
            <Button
              intensity="quiet"
              mood="neutral"
              size="medium"
              onClick={goToPreviousView}
              sx={{ minHeight: "40px" }}
            >
              {translate(I18N_KEYS.WEB_ONBOARDING_CARD_SECONDARY_BTN)}
            </Button>
          </Link>
          <Button
            icon="ActionOpenExternalLinkOutlined"
            layout="iconTrailing"
            mood="brand"
            size="medium"
            onClick={openChosenSite}
          >
            {translate(I18N_KEYS.WEB_ONBOARDING_CARD_PRIMARY_BTN)}
          </Button>
        </footer>
      </div>
    </>
  );
};
