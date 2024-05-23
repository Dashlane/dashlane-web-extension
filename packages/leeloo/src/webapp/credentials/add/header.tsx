import { jsx } from '@dashlane/design-system';
import classnames from 'classnames';
import useTranslate from 'libs/i18n/useTranslate';
import { PanelHeader } from 'webapp/panel';
import styles from 'webapp/credentials/edit/header/styles.css';
export const AddHeader = () => {
    const { translate } = useTranslate();
    return (<PanelHeader icon={<div className={classnames(styles.icon, styles.dummyIcon)}/>} title={translate(`webapp_credential_addition_website`)}/>);
};
