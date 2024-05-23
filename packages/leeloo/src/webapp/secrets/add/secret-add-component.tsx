import { useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Lee } from 'lee';
import { getCurrentSpaceId } from 'libs/webapp';
import { redirect } from 'libs/router';
import { carbonConnector } from 'libs/carbon/connector';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { EditPanel } from 'webapp/panel';
import { SecretsTabs } from 'webapp/secrets/edit/types';
import { SecretOptions } from '../form/secret-options';
import { Header } from '../form/header';
import { SecretForm } from '../form/secret-form';
const { CONTENT } = SecretsTabs;
export interface Props {
    lee: Lee;
}
export const SecretAddPanelComponent = ({ lee }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const premiumStatus = usePremiumStatus();
    const [activeTab, setActiveTab] = useState(CONTENT);
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [secretOptions, setSecretOptions] = useState<SecretOptions>({
        spaceId: getCurrentSpaceId(lee.globalState) ?? '',
    });
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const data = {
        id: '',
        limitedPermissions: false,
        content,
        title,
        ...secretOptions,
    };
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus?.data) {
        return null;
    }
    const showListView = () => {
        redirect(routes.userSecrets);
    };
    const closeAndShowListView = (): void => {
        showListView();
    };
    const saveNote = async () => {
        await carbonConnector.addSecret({
            ...secretOptions,
            content: content,
            title: title,
        });
    };
    const submit = async (): Promise<void> => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            await saveNote();
        }
        catch {
            setIsSubmitting(false);
        }
        showListView();
    };
    const onModifyData = () => setHasDataBeenModified(true);
    return (<EditPanel isViewingExistingItem={false} itemHasBeenEdited={hasDataBeenModified} submitPending={isSubmitting} onSubmit={submit} primaryActions={[]} onNavigateOut={closeAndShowListView} formId="add_secret_panel" header={<Header activeTab={activeTab} displaySharedAccess={false} setActiveTab={setActiveTab} title={title} setTitle={(title) => {
                onModifyData();
                setTitle(title);
            }}/>}>
      <SecretForm activeTab={activeTab} data={data} content={content} setContent={setContent} isAdmin={false} onModifyData={onModifyData} saveSecretOptions={setSecretOptions}/>
    </EditPanel>);
};
