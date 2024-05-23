import { Icon, jsx, Tooltip } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Fragment, useEffect, useState } from 'react';
import { differenceInCalendarDays, fromUnixTime } from 'date-fns';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { usePersonalSettings } from 'libs/carbon/hooks/usePersonalSettings';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { Header } from 'webapp/components/header/header';
import PasswordHistoryButton from 'webapp/password-history/password-history-button';
import { VaultHeaderButton } from './vault-header-button';
import { HeaderAccountMenu } from './header-account-menu';
const I18N_KEYS = {
    ADD: 'credentials_header_add_password',
    IMPORT_DATA_BUTTON: 'webapp_account_root_import_data',
};
interface VaultHeaderProps {
    handleAddNew: (event: React.MouseEvent<HTMLElement>) => void;
    shareButtonElement?: JSX.Element | null;
    addNewDisabled?: boolean;
    tooltipPassThrough?: boolean;
    tooltipContent?: string;
    shouldDisplayPasswordHistoryButton?: boolean;
    shouldDisplayNewAccountImportButton?: boolean;
    shouldDisplayAddButton?: boolean;
}
const DAYS_WE_CONSIDER_NEW = 30;
export const VaultHeader = ({ handleAddNew, tooltipContent, tooltipPassThrough = false, addNewDisabled = false, shareButtonElement = null, shouldDisplayPasswordHistoryButton = false, shouldDisplayNewAccountImportButton = false, shouldDisplayAddButton = true, }: VaultHeaderProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const [accountRelativelyNew, setAccountRelativelyNew] = useState(false);
    const personalSettings = usePersonalSettings();
    const { shouldShowTrialDiscontinuedDialog: isB2BTrialDiscontinued } = useTrialDiscontinuedDialogContext();
    const displayImportButton = isB2BTrialDiscontinued !== null &&
        !isB2BTrialDiscontinued &&
        shouldDisplayNewAccountImportButton &&
        accountRelativelyNew;
    useEffect(() => {
        if (personalSettings.status === DataStatus.Success) {
            const accountCreationDatetime = fromUnixTime(personalSettings.data.accountCreationDatetime);
            const now = new Date();
            const daysSinceCreation = Math.abs(differenceInCalendarDays(now, accountCreationDatetime));
            if (daysSinceCreation <= DAYS_WE_CONSIDER_NEW) {
                setAccountRelativelyNew(true);
            }
        }
    }, [personalSettings.status]);
    const StartWidgets = () => {
        return (<>
        {shouldDisplayAddButton ? (<Tooltip location="bottom" passThrough={tooltipPassThrough} content={tooltipContent} wrapTrigger>
            <VaultHeaderButton onClick={handleAddNew} disabled={addNewDisabled} icon={<Icon name="ActionAddOutlined"/>} isPrimary>
              {translate(I18N_KEYS.ADD)}
            </VaultHeaderButton>
          </Tooltip>) : null}
        {displayImportButton ? (<VaultHeaderButton role="link" icon="DownloadOutlined" onClick={() => history.push(routes.importData)}>
            {translate(I18N_KEYS.IMPORT_DATA_BUTTON)}
          </VaultHeaderButton>) : null}
        {shareButtonElement}
        {shouldDisplayPasswordHistoryButton ? <PasswordHistoryButton /> : null}
      </>);
    };
    const EndWidget = (<>
      <HeaderAccountMenu />
      <NotificationsDropdown />
    </>);
    return <Header startWidgets={StartWidgets} endWidget={EndWidget}/>;
};
