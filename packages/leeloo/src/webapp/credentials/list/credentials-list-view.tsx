import { jsx } from '@dashlane/design-system';
import { useHasCredentialsContext } from '../credentials-view/has-credentials-context';
import { CompromisedCredentialsProvider } from '../credentials-view/compromised-credentials-context';
import { MultiSelectMenu } from './multi-select';
import { CredentialsList } from './credentials-list';
import { CredentialsListEmptyView } from './credentials-list-empty-view';
import { CredentialsListViewHeader } from './credentials-list-view-header';
export const CredentialsListView = () => {
    const hasCredentials = useHasCredentialsContext();
    if (hasCredentials === undefined) {
        return null;
    }
    if (!hasCredentials) {
        return <CredentialsListEmptyView />;
    }
    return (<CompromisedCredentialsProvider>
      <MultiSelectMenu />
      <div style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
        <CredentialsListViewHeader />
        <CredentialsList />
      </div>
    </CompromisedCredentialsProvider>);
};
