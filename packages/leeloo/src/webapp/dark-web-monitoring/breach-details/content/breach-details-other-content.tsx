import classnames from "classnames";
import { Eyebrow, InfoBox } from "@dashlane/ui-components";
import { BreachLeakedDataType } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getFormattedLeakedDataTypes } from "../helpers";
import styles from "../styles.css";
const I18N_KEYS = {
  ACTION_CHANGE_PASSWORD: "webapp_darkweb_alert_action_change_password",
  ADVICE_AVOID_PASSWORD: "webapp_darkweb_alert_advice_avoid_password",
  ADVICE_CHANGE_PASSWORD: "webapp_darkweb_alert_advice_change_password",
  ADVICE_REACH_OUT_CREDIT_CARD:
    "webapp_darkweb_alert_advice_reach_out_credit_card",
  LABEL_DATA: "webapp_darkweb_alert_label_data",
};
interface ContentOtherSectionprops {
  isPasswordLeaked: boolean;
  isCreditCardLeaked: boolean;
  leakedData: BreachLeakedDataType[];
  domain: string | undefined;
}
export const ContentOtherSection = ({
  isPasswordLeaked,
  isCreditCardLeaked,
  leakedData,
  domain,
}: ContentOtherSectionprops) => {
  const { translate } = useTranslate();
  return (
    <section className={styles.section}>
      <Eyebrow
        as="header"
        size="small"
        color="primaries.5"
        sx={{ marginBottom: "4px" }}
      >
        {translate(I18N_KEYS.LABEL_DATA)}
      </Eyebrow>
      <div className={classnames(styles.content, styles.data)}>
        {getFormattedLeakedDataTypes(leakedData, translate)}
      </div>
      {isPasswordLeaked || isCreditCardLeaked ? (
        <InfoBox
          className={styles.adviceBox}
          title={
            isPasswordLeaked
              ? domain === undefined
                ? translate(I18N_KEYS.ADVICE_AVOID_PASSWORD, { count: 1 })
                : translate(I18N_KEYS.ADVICE_CHANGE_PASSWORD, { count: 1 })
              : translate(I18N_KEYS.ADVICE_REACH_OUT_CREDIT_CARD, {
                  domain,
                })
          }
        />
      ) : null}
    </section>
  );
};
