import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { DialogFooter, GridContainer, Paragraph, SearchIcon, TextInput, } from '@dashlane/ui-components';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { RadioButton, RadioButtonGroup, } from 'libs/dashlane-style/radio-button';
import useTranslate from 'libs/i18n/useTranslate';
import { MemberData } from 'team/members/types';
import styles from './confirm-dialog.css';
export const normalize = (s: string) => {
    return s.trim().toLocaleLowerCase();
};
const search = (members: MemberData[], searchString: string) => {
    if (searchString.trim() === '') {
        return members;
    }
    return members.filter(({ login }) => normalize(login).includes(normalize(searchString)));
};
const I18N_KEYS = {
    CONFIRM: 'team_account_billing_admin_dialog_confirm',
    DIALOG_TITLE: 'team_account_billing_admin_dialog_title',
    DISCLAIMER: 'team_account_billing_admin_display_disclaimer',
    SEARCH_FIELD_PLACEHOLDER: 'team_account_billing_admin_search_field_placeholder',
    SEARCH_NO_MATCH: 'team_account_billing_admin_search_no_match',
    WARNING: 'team_account_billing_admin_dialog_warning',
};
interface ConfirmDialogProps {
    defaultSelected: string;
    handleClose: () => void;
    handleConfirmClick: (val: string) => Promise<void>;
    membersList: MemberData[];
    allMembersCount: number;
}
export const ConfirmDialog = ({ defaultSelected, handleConfirmClick, handleClose, allMembersCount, membersList, }: ConfirmDialogProps) => {
    const { translate } = useTranslate();
    const [selectedAdmin, setSelectedAdmin] = useState(defaultSelected);
    const [searchValue, setSearchValue] = useState('');
    const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([]);
    const [searchStarted, setSearchStarted] = useState(false);
    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value }, }) => {
        setSearchValue(value);
        if (!searchStarted) {
            setSearchStarted(true);
        }
    };
    const handleBillingSelection: ChangeEventHandler<HTMLInputElement> = ({ target: { value }, }) => {
        setSelectedAdmin(value);
    };
    useEffect(() => {
        setFilteredMembers(search(membersList, searchValue).slice(0, 5));
    }, [membersList, searchValue]);
    const primaryButtonOnClick = () => handleConfirmClick(selectedAdmin);
    const onDismiss = React.useCallback(() => {
        handleClose();
    }, [handleClose]);
    const submitDisabled = !filteredMembers.length || defaultSelected === selectedAdmin;
    return (<SimpleDialog isOpen showCloseIcon title={translate(I18N_KEYS.DIALOG_TITLE)} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.CONFIRM)} primaryButtonOnClick={primaryButtonOnClick} primaryButtonProps={{
                disabled: submitDisabled,
            }}/>} onRequestClose={onDismiss}>
      <GridContainer gap="1.5em" gridTemplateColumns="auto">
        <Paragraph>{translate(I18N_KEYS.WARNING)}</Paragraph>
        <TextInput fullWidth autoFocus startAdornment={<SearchIcon />} onChange={handleSearchChange} placeholder={translate(I18N_KEYS.SEARCH_FIELD_PLACEHOLDER)}/>
        {filteredMembers.length > 0 ? (<>
            <RadioButtonGroup value={selectedAdmin} onChange={handleBillingSelection} groupName="billingAdmins">
              {filteredMembers.map(({ login }) => (<RadioButton key={login} value={login} className={styles.radioWrapper}>
                  {login}
                </RadioButton>))}
            </RadioButtonGroup>
            <Paragraph color="neutrals.8">
              {filteredMembers.length < allMembersCount
                ? translate(I18N_KEYS.DISCLAIMER, {
                    count: filteredMembers.length || '-',
                    total: allMembersCount || '-',
                })
                : null}
            </Paragraph>
          </>) : null}
        {filteredMembers.length === 0 ? (<Paragraph>{translate(I18N_KEYS.SEARCH_NO_MATCH)}</Paragraph>) : null}
      </GridContainer>
    </SimpleDialog>);
};
