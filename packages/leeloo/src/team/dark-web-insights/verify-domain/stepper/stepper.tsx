import { Card, Flex } from "@dashlane/design-system";
import Step from "../../../page/step";
import numberOne from "../../../page/step/assets/numberOne.svg";
import numberTwo from "../../../page/step/assets/numberTwo.svg";
import numberThree from "../../../page/step/assets/numberThree.svg";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  VERIFY_DOMAIN_TITLE: "team_breach_report_verify_domain_stepper_title",
  VERIFY_DOMAIN_SUBTITLE:
    "team_dark_web_insights_stepper_verify_domain_subtitle",
  VIEW_INSIGHTS_TITLE: "team_dark_web_insights_view_insights_stepper_title",
  VIEW_INSIGHTS_SUBTITLE:
    "team_dark_web_insights_view_insights_stepper_subtitle",
  REDUCE_RISK_TITLE: "team_breach_report_reduce_risk_title",
  REDUCE_RISK_SUBTITLE: "team_breach_report_reduce_risk_subtitle",
};
export const Stepper = () => {
  const { translate } = useTranslate();
  return (
    <Card>
      <Flex
        sx={{
          paddingLeft: "24px",
          borderBottomColor: "ds.border.brand.standard.idle",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
        }}
        justifyContent="space-between"
      >
        <Step
          img={numberOne}
          title={translate(I18N_KEYS.VERIFY_DOMAIN_TITLE)}
          subtitle={translate(I18N_KEYS.VERIFY_DOMAIN_SUBTITLE)}
          titleColor="ds.text.brand.standard"
        />

        <Step
          img={numberTwo}
          title={translate(I18N_KEYS.VIEW_INSIGHTS_TITLE)}
          subtitle={translate(I18N_KEYS.VIEW_INSIGHTS_SUBTITLE)}
        />

        <Step
          img={numberThree}
          title={translate(I18N_KEYS.REDUCE_RISK_TITLE)}
          subtitle={translate(I18N_KEYS.REDUCE_RISK_SUBTITLE)}
        />
      </Flex>
    </Card>
  );
};
