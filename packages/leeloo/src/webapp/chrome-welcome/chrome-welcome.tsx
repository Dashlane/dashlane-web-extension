import {
  Button,
  ExpressiveIcon,
  Logo,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { redirect } from "../../libs/router";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { setOnboardingMode } from "../onboarding/services";
import styles from "./chrome-welcome.css";
import chromeWelcomeIllustration from "./images/chrome-welcome-illustration.svg";
export const I18N_KEYS = {
  DASHLANE_LOGO_TITLE: "_common_dashlane_logo_title",
  MARKETING_PANEL_HEADING: "chrome_welcome_marketing_panel_heading",
  MARKETING_PANEL_DESCRIPTION: "chrome_welcome_marketing_panel_description",
  MARKETING_PANEL_LIST_ITEM_REVEAL:
    "chrome_welcome_marketing_panel_list_item_reveal_heading",
  MARKETING_PANEL_LIST_ITEM_PASSWORD_CHANGER:
    "chrome_welcome_marketing_panel_list_item_open_website_heading",
  MARKETING_PANEL_LIST_ITEM_WEB:
    "chrome_welcome_marketing_panel_list_item_generator_heading",
  ILLUSTRATION_PANEL_IMG_ALT: "chrome_welcome_illustration_img_alt",
  ILLUSTRATION_PANEL_DESCRIPTION:
    "chrome_welcome_illustration_panel_description",
  ILLUSTRATION_PANEL_BUTTON: "chrome_welcome_illustration_panel_button",
};
export const ChromeWelcome = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const handleButtonClick = () => {
    setOnboardingMode({
      completedSteps: { onboardingHubShown: true },
    });
    redirect(routes.userOnboarding);
  };
  return (
    <div sx={{ display: "flex", height: "100vh" }}>
      <div
        className={styles.container}
        sx={{
          backgroundColor: "ds.background.alternate",
        }}
      >
        <Logo
          className={styles.dashlaneIcon}
          height={40}
          name="DashlaneLockup"
          title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}
        />
        <div className={styles.content}>
          <Paragraph
            role="heading"
            textStyle="ds.specialty.brand.medium"
            sx={{ marginBottom: "40px" }}
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.MARKETING_PANEL_HEADING)}
          </Paragraph>

          <Paragraph
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
            sx={{ marginBottom: "16px" }}
          >
            {translate(I18N_KEYS.MARKETING_PANEL_DESCRIPTION)}
          </Paragraph>
          <ul className={styles.listContainer}>
            <li className={styles.listItem}>
              <ExpressiveIcon
                name="ActionRevealOutlined"
                mood="neutral"
                size="small"
              />
              <Paragraph sx={{ marginLeft: "8px" }}>
                {translate(I18N_KEYS.MARKETING_PANEL_LIST_ITEM_REVEAL)}
              </Paragraph>
            </li>
            <li className={styles.listItem}>
              <ExpressiveIcon
                name="FeaturePasswordGeneratorOutlined"
                mood="neutral"
                size="small"
              />
              <Paragraph sx={{ marginLeft: "8px" }}>
                {translate(
                  I18N_KEYS.MARKETING_PANEL_LIST_ITEM_PASSWORD_CHANGER
                )}
              </Paragraph>
            </li>
            <li className={styles.listItem}>
              <ExpressiveIcon name="WebOutlined" mood="neutral" size="small" />
              <Paragraph sx={{ marginLeft: "8px" }}>
                {translate(I18N_KEYS.MARKETING_PANEL_LIST_ITEM_WEB)}
              </Paragraph>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={styles.container}
        sx={{
          backgroundColor: "ds.container.agnostic.neutral.supershy",
        }}
      >
        <div className={styles.content}>
          <img
            className={styles.illustration}
            src={chromeWelcomeIllustration}
            alt={translate(I18N_KEYS.ILLUSTRATION_PANEL_IMG_ALT)}
          />
          <Paragraph
            sx={{ marginTop: "8px" }}
            textStyle="ds.body.reduced.regular"
          >
            {translate(I18N_KEYS.ILLUSTRATION_PANEL_DESCRIPTION)}
          </Paragraph>
          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              onClick={handleButtonClick}
              sx={{
                marginTop: "40px",
              }}
            >
              {translate(I18N_KEYS.ILLUSTRATION_PANEL_BUTTON)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
