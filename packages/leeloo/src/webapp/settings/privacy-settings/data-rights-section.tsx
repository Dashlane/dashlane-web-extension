import { Button, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Setting } from "../shared/setting";
import { privacyItemList } from "./resources/data";
const I18N_KEYS = {
  TITLE: "webapp_privacy_settings_data_rights_title",
};
export const DataRightsSection = () => {
  const { translate } = useTranslate();
  return (
    <Setting title={translate(I18N_KEYS.TITLE)}>
      {privacyItemList.map((privacyItem) => {
        return (
          <div key={privacyItem.title} sx={{ width: "100%" }}>
            <div sx={{ gap: "8px", display: "inline" }}>
              <Paragraph
                textStyle="ds.title.block.medium"
                color="ds.text.neutral.catchy"
              >
                {translate(privacyItem.title)}
              </Paragraph>
              <Paragraph
                color="ds.text.neutral.quiet"
                sx={{ margin: "16px 0" }}
              >
                {translate(privacyItem.description)}
              </Paragraph>
              {privacyItem.cta ? (
                <Button
                  intensity="quiet"
                  role="link"
                  onClick={() => {
                    window.open(privacyItem.cta.link);
                  }}
                  sx={{ marginBottom: "16px" }}
                >
                  {translate(privacyItem.cta.label)}
                </Button>
              ) : null}
            </div>
            {!privacyItem.noDivider ? (
              <hr
                sx={{
                  border: "none",
                  borderTop: "1px solid ds.border.neutral.quiet.idle",
                  margin: "10px 0",
                  width: "100%",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </Setting>
  );
};
