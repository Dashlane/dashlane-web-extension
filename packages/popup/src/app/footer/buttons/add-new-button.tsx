import { Button, Icon, jsx } from '@dashlane/design-system';
import { useActiveTabInfoContext as useVaultActiveTabInfoContext } from 'src/app/vault/tabs-bar/active-tab-info-context';
import { TabName } from 'src/app/vault/tabs-bar/tabs-data';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import useTranslate from 'src/libs/i18n/useTranslate';
import { useShowPasswordLimit } from 'src/libs/hooks/use-show-password-limit';
import { getAddNewInfo } from './utility';
export const AddNewButton = () => {
    const { activeTabInfo } = useVaultActiveTabInfoContext();
    const { translate } = useTranslate();
    const passwordLimit = useShowPasswordLimit();
    if (passwordLimit === null) {
        return null;
    }
    const showPasswordLimitTooltip = passwordLimit.shouldDisplayPasswordLimitBanner &&
        activeTabInfo.name === TabName.Passwords;
    const addNewInfo = getAddNewInfo(activeTabInfo.name);
    const title = translate(addNewInfo.translationKey);
    const handleAddNew = () => {
        void openWebAppAndClosePopup({
            id: addNewInfo.routeId,
            route: addNewInfo.route,
        });
    };
    return (<Button onClick={handleAddNew} key="add-new" mood="neutral" layout="iconOnly" title={title} aria-label={title} tooltip={showPasswordLimitTooltip
            ? translate('footer/add_button/password_limit_reached')
            : null} role="link" intensity="supershy" icon={<Icon name="ActionAddOutlined"/>}/>);
};
