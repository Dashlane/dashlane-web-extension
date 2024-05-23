import * as React from 'react';
import _ from 'lodash';
import { Button, Icon, jsx, WebsiteField } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { AddLinkedWebsiteButton } from './add-linked-website-button';
import { goToWebsite } from './helpers';
const I18N_KEYS = {
    NEW_WEBSITE_PLACEHOLDER: 'webapp_credential_linked_websites_new_website_placeholder',
    DELETE: 'webapp_credential_linked_websites_action_delete',
    GO_TO_WEBSITE: 'webapp_credential_linked_websites_action_goto',
    ADD_LINKED_WEBSITE: 'webapp_credential_edition_linked_websites_add_website',
};
const getUrlWithoutProtocol = (url: string): string => {
    const urlCaptureRegex = /^(?:\w+:\/\/)?(.*)$/;
    const match = url.match(urlCaptureRegex);
    return match && match.length >= 2 ? match[1] : url;
};
type Row = {
    linkedWebsite: string;
    id: number;
};
interface LinkedWebsitesListProps {
    linkedWebsitesList: string[];
    areItemsLocked: boolean;
    credentialId: string;
    isListEditable?: boolean;
    isEditing?: boolean;
    showUrlProtocol?: boolean;
    updateLinkedWebsitesList?: (linkedWebsites: string[]) => void;
}
const LinkedWebsitesListComponent = ({ linkedWebsitesList, credentialId, isListEditable = false, isEditing = false, showUrlProtocol = false, updateLinkedWebsitesList, }: LinkedWebsitesListProps) => {
    const { translate } = useTranslate();
    const focusField = React.useRef<HTMLInputElement>(null);
    const [addWebsiteButtonDisabled, setAddWebsiteButtonDisabled] = React.useState(false);
    const [counter, setCounter] = React.useState(linkedWebsitesList.length);
    const [rows, setRows] = React.useState<Row[]>(linkedWebsitesList.map((website, index) => {
        return {
            linkedWebsite: website,
            id: index,
        };
    }));
    const onAddNewItem = (event?: MouseEvent) => {
        setAddWebsiteButtonDisabled(true);
        const newCount = counter + 1;
        setRows([...rows, { linkedWebsite: '', id: newCount }]);
        setCounter(newCount);
        event?.preventDefault();
        event?.stopPropagation();
    };
    const onRemoveItem = (id: number) => {
        setRows(rows.filter((row) => row.id !== id));
    };
    const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const id = Number(name);
        const itemToModify = rows.findIndex((row) => row.id === id);
        if (itemToModify !== -1) {
            const modifiedRows = _.cloneDeep(rows);
            modifiedRows[itemToModify].linkedWebsite = value;
            setRows(modifiedRows);
        }
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onAddNewItem();
        }
    };
    const updateAddWebsiteButtonStatus = (rows: Row[]) => {
        if (rows.every((row) => row.linkedWebsite)) {
            setAddWebsiteButtonDisabled(false);
        }
        else {
            setAddWebsiteButtonDisabled(true);
        }
    };
    React.useEffect(() => {
        if (isEditing) {
            onAddNewItem();
        }
    }, []);
    React.useEffect(() => {
        if (counter !== linkedWebsitesList.length) {
            focusField.current?.focus();
        }
    }, [counter]);
    React.useEffect(() => {
        updateLinkedWebsitesList?.(rows.map(({ linkedWebsite }) => linkedWebsite));
        updateAddWebsiteButtonStatus(rows);
    }, [updateLinkedWebsitesList, JSON.stringify(rows)]);
    return (<div>
      {isListEditable ? (<div>
          {rows.map(({ linkedWebsite, id }, index) => (<WebsiteField className="row" key={id} name={id.toString()} label="example.com" labelPersists={false} placeholder={translate(I18N_KEYS.NEW_WEBSITE_PLACEHOLDER)} ref={focusField} onChange={handleInputValue} onKeyDown={handleKeyPress} value={linkedWebsite} showOpenWebsite={{
                    label: translate(I18N_KEYS.GO_TO_WEBSITE),
                    onClick: () => goToWebsite(linkedWebsite, credentialId),
                }} actions={[
                    <Button key="delete" data-testid="delete-button" layout="iconOnly" mood="brand" intensity="supershy" onClick={() => onRemoveItem(id)} aria-label={translate(I18N_KEYS.DELETE)} icon={<Icon name="ActionDeleteOutlined"/>} tooltip={translate(I18N_KEYS.DELETE)}/>,
                ]} sx={{ marginTop: index === 0 ? '0px' : '8px' }}/>))}
          <div sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AddLinkedWebsiteButton disabled={addWebsiteButtonDisabled} handleOnClickAddLinkedWebsiteButton={onAddNewItem} label={translate(I18N_KEYS.ADD_LINKED_WEBSITE)}/>
          </div>
        </div>) : (<div>
          {rows.map(({ linkedWebsite, id }, index) => (<WebsiteField className="readonly-row" key={id} label="example.com" labelPersists={false} readOnly value={showUrlProtocol
                    ? linkedWebsite
                    : getUrlWithoutProtocol(linkedWebsite)} showOpenWebsite={{
                    label: translate(I18N_KEYS.GO_TO_WEBSITE),
                    onClick: () => goToWebsite(linkedWebsite, credentialId),
                }} sx={{ marginTop: index === 0 ? '0px' : '8px' }}/>))}
        </div>)}
    </div>);
};
export const LinkedWebsitesList = React.memo(LinkedWebsitesListComponent);
