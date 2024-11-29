import classnames from "classnames";
import { Eyebrow, InfoBox, PasswordInput } from "@dashlane/ui-components";
import { BreachLeakedDataType } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getFormattedLeakedDataTypes } from "../helpers";
import styles from "../styles.css";
import { Fragment } from "@dashlane/design-system/jsx-runtime";
const I18N_KEYS = {
  ADVICE_AVOID_PASSWORD: "webapp_darkweb_alert_advice_avoid_password",
  ADVICE_CHANGE_PASSWORD: "webapp_darkweb_alert_advice_change_password",
  LABEL_OTHER_DATA: "webapp_darkweb_alert_label_other_data",
  LABEL_PASSWORD: "webapp_darkweb_alert_label_password2",
  PASSWORD_HIDE: "webapp_darkweb_alert_password_hide",
  PASSWORD_SHOW: "webapp_darkweb_alert_password_show",
};
interface ContentOtherSectionprops {
  passwords: string[];
  leakedData: BreachLeakedDataType[];
  domain: string | undefined;
}
export const ContentPasswordSection = ({
  passwords,
  leakedData,
  domain,
}: ContentOtherSectionprops) => {
  const { translate } = useTranslate();
  return (
    <Fragment>
      <section className={styles.section}>
        <Eyebrow
          as="header"
          size="small"
          color="primaries.5"
          sx={{ marginBottom: "4px" }}
        >
          {translate(I18N_KEYS.LABEL_PASSWORD, {
            count: passwords.length,
          })}
        </Eyebrow>
        {passwords.map((password) => (
          <PasswordInput
            key={password}
            hidePasswordTooltipText={translate(I18N_KEYS.PASSWORD_HIDE)}
            showPasswordTooltipText={translate(I18N_KEYS.PASSWORD_SHOW)}
            value={password}
            readOnly
          />
        ))}
        <InfoBox
          className={styles.adviceBox}
          title={
            domain === undefined
              ? translate(I18N_KEYS.ADVICE_AVOID_PASSWORD, {
                  count: passwords.length,
                })
              : translate(I18N_KEYS.ADVICE_CHANGE_PASSWORD, {
                  count: passwords.length,
                })
          }
        />
      </section>
      {leakedData.length > 1 ? (
        <section className={styles.section}>
          <Eyebrow
            as="header"
            size="small"
            color="primaries.5"
            sx={{ marginBottom: "4px" }}
          >
            {translate(I18N_KEYS.LABEL_OTHER_DATA)}
          </Eyebrow>
          <div className={classnames(styles.content, styles.data)}>
            {getFormattedLeakedDataTypes(leakedData, translate, true)}
          </div>
        </section>
      ) : null}
    </Fragment>
  );
};
