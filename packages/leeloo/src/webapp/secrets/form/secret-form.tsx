import { Fragment } from 'react';
import { jsx } from '@dashlane/ui-components';
import { NoteType } from '@dashlane/communication';
import { SecretsTabs } from 'webapp/secrets/edit/types';
import { SharedAccess } from 'webapp/shared-access';
import { SecretsContent } from 'webapp/secrets/form/content';
import styles from './style.css';
import { TextMaxSizeReached } from './textMaxSizeReached';
import { SecretOptions, SecretOptionsForm } from './secret-options';
import { SaveSecretContentValues } from 'webapp/personal-data/types';
const { CONTENT, MORE_OPTIONS, SHARED_ACCESS } = SecretsTabs;
export interface Props {
    activeTab: SecretsTabs;
    data: SaveSecretContentValues;
    content: string;
    setContent: (content: string) => void;
    isAdmin: boolean;
    onModifyData: () => void;
    saveSecretOptions: (options: SecretOptions) => void;
}
export interface State {
    headerBackground: NoteType;
    textSize: number;
}
export const MAX_AUTHORIZED_CHARACTERS = 10000;
export const SecretForm = ({ activeTab, data, content, setContent, isAdmin, onModifyData, saveSecretOptions, }: Props) => {
    return (<>
      {activeTab === CONTENT && (<>
          <div className={styles.formContent}>
            <SecretsContent content={content} setContent={(content) => {
                onModifyData();
                setContent(content);
            }} limitedPermissions={data.limitedPermissions}/>
          </div>
          <TextMaxSizeReached maxAuthorizedSize={MAX_AUTHORIZED_CHARACTERS} currentSize={content.length}/>
        </>)}

      {activeTab === SHARED_ACCESS && (<SharedAccess isAdmin={isAdmin} id={data.id}/>)}

      {activeTab === MORE_OPTIONS && (<SecretOptionsForm data={{
                spaceId: data.spaceId ?? '',
            }} saveSecretOptions={(options) => {
                saveSecretOptions(options);
            }}/>)}
    </>);
};
