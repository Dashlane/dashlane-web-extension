import * as React from 'react';
import classnames from 'classnames';
import { windowsGetCurrent } from '@dashlane/webextensions-apis';
import { AddIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useShowPasswordLimit } from 'libs/hooks/use-show-password-limit';
import { openWebAppAndClosePopup } from 'app/helpers';
import styles from './styles.css';
const I18N_KEYS = {
    CTA: 'tab/all_items/empty_cta',
    SUGGESTEDITEMS_SUBTITLE: 'tab/all_items/suggested_item_section/add_password/subtitle',
    SUGGESTEDITEMS_TITLE: 'tab/all_items/suggested_item_section/add_password/title'
};
interface Props {
    name?: string;
    website?: string;
    origin: string;
}
export const AddPasswordItem = ({ name, website = '', origin }: Props) => {
    const { translate } = useTranslate();
    const passwordLimit = useShowPasswordLimit();
    const openAddNewCredential = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const webappQuery = {
            name: name ? name : '',
            website,
        };
        void openWebAppAndClosePopup({
            id: 'new',
            query: webappQuery,
            route: '/passwords',
        });
    };
    const [favIconUrlSpec, setFavIconUrlSpec] = React.useState('');
    React.useEffect(() => {
        const setIcon = async () => {
            const activeWindow = await windowsGetCurrent({ populate: true });
            const activeTab = activeWindow.tabs?.find((tab) => tab.active);
            setFavIconUrlSpec(activeTab?.favIconUrl ?? '');
        };
        void setIcon();
    }, []);
    if (passwordLimit === null ||
        passwordLimit.shouldDisplayPasswordLimitBanner) {
        return null;
    }
    return (<button className={styles.button} onClick={openAddNewCredential} type="button">
      <div className={classnames(styles.addPasswordContainer, {
            [styles.addPasswordContainerSuggested]: origin === 'suggested',
        })}>
        <div className={classnames(styles.addPasswordThumbnail, favIconUrlSpec ? styles.withFavIcon : '')}>
          <AddIcon />
          <div style={{
            backgroundImage: favIconUrlSpec
                ? `url("${favIconUrlSpec}") `
                : '',
        }} className={styles.addPasswordThumbnailBackground}/>
          <div className={styles.addPasswordThumbnailInnerContainer}>
            <div style={{
            backgroundImage: favIconUrlSpec
                ? `url("${favIconUrlSpec}") `
                : '',
        }} className={styles.addPasswordInnerThumbnail}/>
          </div>
        </div>
        <div className={styles.text}>
          {origin === 'list' && (<div className={styles.title}>{translate(I18N_KEYS.CTA)}</div>)}
          {origin === 'suggested' && (<>
              <div className={styles.title}>
                {translate(I18N_KEYS.SUGGESTEDITEMS_TITLE)}
              </div>
              <div className={styles.subTitle}>
                {translate(I18N_KEYS.SUGGESTEDITEMS_SUBTITLE)}
              </div>
            </>)}
        </div>
      </div>
    </button>);
};
