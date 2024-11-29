import { Paragraph } from "@dashlane/design-system";
import { Accordion } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TranslationOptions } from "../../../libs/i18n/types";
import {
  HOTSPOTSHIELD_SUPPORT_URL,
  VPN_FAQ_LINK,
  VPN_READ_MORE_LINK,
} from "../helpers/links";
import { VpnFaqSection } from "./vpn-faq-section";
const I18N_KEYS: Record<string, TranslationOptions> = {
  TITLE: { key: "webapp_vpn_page_faq_title" },
  GENERAL_SUMMARY: {
    key: "webapp_vpn_page_faq_general_summary",
  },
  GENERAL_DETAILS1: {
    key: "webapp_vpn_page_faq_general_details1",
  },
  GENERAL_DETAILS2_MARKUP: {
    key: "webapp_vpn_page_faq_general_details2_markup",
    params: {
      vpnReadMore: VPN_READ_MORE_LINK,
    },
  },
  HOTSPOT_SUMMARY: {
    key: "webapp_vpn_page_faq_hotspot_summary",
  },
  HOTSPOT_DETAILS: {
    key: "webapp_vpn_page_faq_hotspot_details",
  },
  SUPPORT_SUMMARY: {
    key: "webapp_vpn_page_faq_support_summary",
  },
  SUPPORT_DETAILS1_MARKUP: {
    key: "webapp_vpn_page_faq_support_details1_markup",
    params: {
      faq: VPN_FAQ_LINK,
    },
  },
  SUPPORT_DETAILS2_MARKUP: {
    key: "webapp_vpn_page_faq_support_details2_markup",
    params: {
      hotspotSupport: HOTSPOTSHIELD_SUPPORT_URL,
    },
  },
};
export const VpnFaq = () => {
  const { translate } = useTranslate();
  return (
    <section sx={{ marginTop: "32px" }}>
      <Paragraph
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.TITLE.key)}
      </Paragraph>

      <Accordion sx={{ marginTop: "16px" }}>
        <VpnFaqSection
          summary={I18N_KEYS.GENERAL_SUMMARY}
          parts={[
            I18N_KEYS.GENERAL_DETAILS1,
            I18N_KEYS.GENERAL_DETAILS2_MARKUP,
          ]}
        />
        <VpnFaqSection
          summary={I18N_KEYS.HOTSPOT_SUMMARY}
          parts={[I18N_KEYS.HOTSPOT_DETAILS]}
        />
        <VpnFaqSection
          summary={I18N_KEYS.SUPPORT_SUMMARY}
          parts={[
            I18N_KEYS.SUPPORT_DETAILS1_MARKUP,
            I18N_KEYS.SUPPORT_DETAILS2_MARKUP,
          ]}
        />
      </Accordion>
    </section>
  );
};
