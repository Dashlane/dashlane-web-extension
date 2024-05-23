import { jsx } from '@dashlane/design-system';
import { useEffect } from 'react';
import { NoteSortField } from '@dashlane/communication';
import { PageView } from '@dashlane/hermes';
import { logPageView } from 'libs/logs/logEvent';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { SortingOptions } from 'webapp/list-view/types';
import { initSecureFilesStorageInfo } from 'webapp/secure-files/services';
import { UpgradeNoticeBanner, UpgradeNoticeType, } from 'webapp/credentials/header/upgrade-notice-banner';
import { SecureNotesHeader } from './header/secure-notes-header';
import { SecureNotesProvider } from './secure-notes-view/secure-notes-context';
import { SecureNotesListView } from './list/secure-notes-list-view';
export interface State {
    sortingOptions: SortingOptions<NoteSortField>;
}
export const SecureNotes = () => {
    useEffect(() => {
        initSecureFilesStorageInfo();
        logPageView(PageView.ItemSecureNoteList);
    }, []);
    return (<SecureNotesProvider>
      <PersonalDataSectionView>
        <SecureNotesHeader />
        <UpgradeNoticeBanner customSx={{ margin: '0 32px 30px' }} noticeType={UpgradeNoticeType.SecureNotes}/>
        <SecureNotesListView />
      </PersonalDataSectionView>
    </SecureNotesProvider>);
};
