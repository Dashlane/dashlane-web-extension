import {
  Button,
  Flex,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { OutsideClickHandler } from "../../../libs/outside-click-handler/outside-click-handler";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { openDashlaneUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAccountInfo } from "../../../libs/carbon/hooks/useAccountInfo";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import zIndexVars from "../../../libs/dashlane-style/globals/z-index-variables.css";
import colorVars from "../../../libs/dashlane-style/globals/color-variables.css";
import { getPlanRenewalPeriodicity } from "../../../libs/premium-status.lib";
import { goToCheckoutPage } from "../../notifications-hub/helpers";
import {
  cancelPaywallLog,
  panelToPageView,
  PAYWALL_ACTION,
  PAYWALL_SUBTYPE,
  PAYWALL_TYPE,
  seeAllPlansLog,
  upGradeToPremiumLog,
} from "../logs";
import { useTranslateWithMarkup } from "../../../libs/i18n/useTranslateWithMarkup";
import { TranslationOptions } from "../../../libs/i18n/types";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import { useEffect } from "react";
interface PaywallFeature {
  icon: React.ReactNode;
  key: string;
  title: TranslationOptions | string;
  description: TranslationOptions | string;
}
export enum PaywallTarget {
  Essentials = "essentials",
  Premium = "premium",
}
export interface PaywallProps {
  paywallType: PAYWALL_SUBTYPE;
  mode: "fullscreen" | "popup";
  title: TranslationOptions | string;
  description: TranslationOptions | string;
  paywallFeatures: PaywallFeature[];
  target?: PaywallTarget;
  closePaywall?: () => void;
  withDefaultFooter?: boolean;
  customFooter?: React.ReactNode;
  lightBackground?: boolean;
  headingBadge?: React.ReactNode;
}
const I18N_KEYS = {
  GO_TO_PLANS: "webapp_paywall_go_to_plans",
  UPGRADE_PREMIUM: "webapp_paywall_upgrade_premium",
  UPGRADE_ESSENTIALS: "webapp_paywall_upgrade_essentials",
  CLOSE_TITLE: "webapp_paywall_close",
};
export const GenericPaywall: React.FC<PaywallProps> = (props) => {
  const {
    target,
    title,
    mode,
    description,
    paywallFeatures,
    closePaywall,
    paywallType,
    lightBackground,
    withDefaultFooter,
    headingBadge,
    customFooter,
  } = props;
  const { routes } = useRouterGlobalSettingsContext();
  const { translateWithMarkup } = useTranslateWithMarkup();
  const { translate } = useTranslate();
  const accountInfo = useAccountInfo();
  const subscriptionCode = useSubscriptionCode();
  const premiumStatus = usePremiumStatus();
  useEffect(() => {
    if (premiumStatus.status === DataStatus.Success && premiumStatus.data) {
      logPageView(panelToPageView[paywallType]);
    }
  }, [paywallType, premiumStatus]);
  if (premiumStatus.status !== DataStatus.Success) {
    return null;
  }
  const close = () => {
    if (mode === "popup" && closePaywall) {
      logEvent(cancelPaywallLog);
      closePaywall();
    }
  };
  const goToCheckout = () => {
    const pricing = getPlanRenewalPeriodicity(
      accountInfo?.premiumStatus?.autoRenewInfo
    );
    const isEssentials = target === PaywallTarget.Essentials;
    const actionUsed = isEssentials
      ? PAYWALL_ACTION.GO_ESSENTIALS
      : PAYWALL_ACTION.GO_PREMIUM;
    const tracking = {
      type: PAYWALL_TYPE.PREMIUM_PROMPT,
      subtype: paywallType,
      action: actionUsed,
    };
    goToCheckoutPage(
      "",
      subscriptionCode ?? "",
      tracking,
      isEssentials,
      pricing
    );
    logEvent(upGradeToPremiumLog);
  };
  const goToPlans = () => {
    const tracking = {
      type: PAYWALL_TYPE.PREMIUM_PROMPT,
      subtype: paywallType,
      action: PAYWALL_ACTION.GO_PLANS,
    };
    openDashlaneUrl(routes.userGoPlans, tracking);
    logEvent(seeAllPlansLog);
  };
  const goToCheckoutText =
    target === PaywallTarget.Essentials
      ? I18N_KEYS.UPGRADE_ESSENTIALS
      : I18N_KEYS.UPGRADE_PREMIUM;
  return (
    <Flex
      sx={{
        position: "absolute",
        zIndex: zIndexVars["--z-index-above-panel"],
        top: "0px",
        overflow: "auto",
        width: "100%",
        height: "100%",
        backgroundColor: lightBackground
          ? "ds.container.agnostic.neutral.standard"
          : colorVars["--transparent-dash-green-00-background-color"],
      }}
      justifyContent="center"
      alignItems="center"
    >
      <OutsideClickHandler onOutsideClick={close}>
        <Flex
          sx={{
            position: "relative",
            width: ["auto", "auto", "800px"],
            backgroundColor: "ds.background.default",
            borderRadius: "4px",
            padding: ["32px", "32px", "88px 88px 46px 88px"],
          }}
          justifyContent="center"
          flexDirection="column"
        >
          {mode === "popup" ? (
            <button
              sx={{
                position: "absolute",
                cursor: "pointer",
                background: "transparent",
                top: "21px",
                right: "21px",
              }}
              type="button"
              aria-label={translate(I18N_KEYS.CLOSE_TITLE)}
              title={translate(I18N_KEYS.CLOSE_TITLE)}
              onClick={close}
            >
              <Icon
                name="ActionCloseOutlined"
                size="small"
                color="ds.text.neutral.standard"
              />
            </button>
          ) : null}

          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flexStart",
              gap: "8px",
            }}
          >
            {headingBadge}
            <Heading
              as="h2"
              textStyle="ds.title.section.large"
              color="ds.text.neutral.catchy"
            >
              {translateWithMarkup(title)}
            </Heading>
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.standard.regular"
            >
              {translateWithMarkup(description)}
            </Paragraph>
          </div>

          <ul sx={{ mt: "32px", mb: "32px" }}>
            {paywallFeatures.map((paywallFeature) => (
              <li
                sx={{
                  marginTop: "32px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  svg: { flexShrink: 0 },
                }}
                key={paywallFeature.key}
              >
                {paywallFeature.icon}
                <div sx={{ marginLeft: "16px", lineHeight: "18px" }}>
                  <Paragraph
                    color="ds.text.neutral.catchy"
                    textStyle="ds.title.block.medium"
                  >
                    {translateWithMarkup(paywallFeature.title)}
                  </Paragraph>

                  <div sx={{ marginTop: "4px" }}>
                    <Paragraph
                      color="ds.text.neutral.quiet"
                      textStyle="ds.body.reduced.regular"
                    >
                      {translateWithMarkup(paywallFeature.description)}
                    </Paragraph>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {withDefaultFooter ? (
            <Flex
              justifyContent="flex-end"
              sx={{
                mt: "36px",
                mr: ["0px", "0px", "-44px"],
                button: { ml: "8px" },
              }}
            >
              <Button onClick={goToPlans} mood="neutral" intensity="quiet">
                {translate(I18N_KEYS.GO_TO_PLANS)}
                <Icon
                  name="ActionOpenExternalLinkOutlined"
                  size="small"
                  color="ds.text.neutral.standard"
                />
              </Button>
              <Button onClick={goToCheckout}>
                {translate(goToCheckoutText)}
              </Button>
            </Flex>
          ) : (
            customFooter
          )}
        </Flex>
      </OutsideClickHandler>
    </Flex>
  );
};
