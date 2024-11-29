import * as React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { Footer } from "../../libs/dashlane-style/footer";
import styles from "./styles.css";
import { Logo } from "@dashlane/design-system";
export const JoinFamily = ({ children }: React.PropsWithChildren<{}>) => {
  const { translate } = useTranslate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.joinFamilyWrapper}>
        <div className={styles.logo}>
          <Logo
            height={40}
            name="DashlaneLockup"
            title={translate("_common_dashlane_logo_title")}
          />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
};
