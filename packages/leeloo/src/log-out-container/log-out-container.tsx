import * as React from "react";
import { useHistory } from "../libs/router";
import { Button } from "@dashlane/ui-components";
import { DispatchGlobal } from "../store/types";
import useTranslate from "../libs/i18n/useTranslate";
import styles from "./log-out-container.css";
import { LOGIN_URL_SEGMENT } from "../app/routes/constants";
import { useLogout } from "../libs/hooks/useLogout";
export interface Props {
  dispatchGlobal: DispatchGlobal;
}
const I18N_KEYS = {
  BACK_TO_LOGIN_LABEL: "webapp_account_recovery_back_to_login",
};
export const LogOutContainer = ({ dispatchGlobal }: Props) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const logout = useLogout(dispatchGlobal);
  const onLogoutClick = () => {
    logout();
    history.replace(LOGIN_URL_SEGMENT);
  };
  return (
    <div className={styles.logoutContainer}>
      <Button nature="secondary" type="button" onClick={onLogoutClick}>
        {translate(I18N_KEYS.BACK_TO_LOGIN_LABEL)}
      </Button>
    </div>
  );
};
