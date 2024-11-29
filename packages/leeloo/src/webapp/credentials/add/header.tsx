import classnames from "classnames";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PanelHeader } from "../../panel";
import styles from "../edit/header/styles.css";
export const AddHeader = () => {
  const { translate } = useTranslate();
  return (
    <PanelHeader
      icon={<div className={classnames(styles.icon, styles.dummyIcon)} />}
      title={translate(`webapp_credential_addition_website`)}
    />
  );
};
