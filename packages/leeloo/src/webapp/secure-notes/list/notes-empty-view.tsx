import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { EmptyView } from 'webapp/empty-view/empty-view';
import { PaywallManager, PaywallName } from 'webapp/paywall';
const I18N_KEYS = {
    TITLE: 'webapp_secure_notes_empty_view_title',
    DESCRIPTION: 'webapp_secure_notes_empty_view_description',
    IMPORT_DATA_BUTTON: 'webapp_account_root_import_data',
    ADD_NOTE_BUTTON: 'webapp_secure_notes_header_add',
};
export const NotesEmptyView = () => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const onClickAddNew = () => {
        history.push(routes.userAddBlankNote);
    };
    return (<PaywallManager mode="fullscreen" paywall={PaywallName.SecureNote}>
      <EmptyView icon={<Icon name="ItemSecureNoteOutlined" color="ds.text.neutral.standard" sx={{ width: '64px', minWidth: '64px', height: '64px' }}/>} title={translate(I18N_KEYS.TITLE)}>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
        <FlexContainer gap={4} justifyContent="center" sx={{ marginTop: '16px' }}>
          <Button layout="iconLeading" icon="ActionAddOutlined" onClick={onClickAddNew}>
            {translate(I18N_KEYS.ADD_NOTE_BUTTON)}
          </Button>
          <Button layout="iconLeading" icon="DownloadOutlined" mood="neutral" intensity="quiet" onClick={() => history.push(routes.importData)}>
            {translate(I18N_KEYS.IMPORT_DATA_BUTTON)}
          </Button>
        </FlexContainer>
      </EmptyView>
    </PaywallManager>);
};
