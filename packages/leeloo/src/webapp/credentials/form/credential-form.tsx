import React, { Dispatch, forwardRef, Fragment, SetStateAction, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { PasswordGenerationSettings, PremiumStatusSpace, } from '@dashlane/communication';
import { AnonymousCopyVaultItemFieldEvent, DomainType, hashDomain, ItemType, UserCopyVaultItemFieldEvent, Field as VaultItemField, } from '@dashlane/hermes';
import { AlertSeverity } from '@dashlane/ui-components';
import { ParsedURL } from '@dashlane/url-parser';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { Field, isValueFieldVisible, } from 'webapp/credentials/form/credentialSettings';
import { ChangedValues } from 'webapp/personal-data/edit/form/common';
import { SpaceSelect } from 'webapp/space-select/space-select';
import { UnlockerAction } from 'webapp/unlock-items';
import { LockedItemType, ProtectedItemsUnlockerProps, } from 'webapp/unlock-items/types';
import { CopyToClipboardButton } from '../edit/copy-to-clipboard-control';
import { CredentialPreferences } from '../preferences/containers/credential-preferences';
import { CollectionsField, CollectionsFieldRef, } from './collections-field/collections-field';
import { FieldCollection } from './collections-field/collections-field-context';
import { capitalizedCredUrlDomainName, goToWebsite, logRevealPassword, } from './helpers';
import { PasswordChangeButton } from './password-change-button';
import { CredentialCreationWebsitesComponent } from './websites/credential-creation-form-websites';
import { CredentialEditionWebsitesComponent } from './websites/credential-edition-form-websites';
import { ContentCard } from 'webapp/panel/standard/content-card';
import { Button, EmailField, jsx, PasswordField, TextArea, TextField, Tooltip, } from '@dashlane/design-system';
import { GeneratePasswordCard } from '../password-generator/generate-password-card';
import { DataStatus } from '@dashlane/framework-react';
import { CredentialOtpField } from './credential-otp-code/credential-otp-field';
import { usePasswordScore } from '../hooks/use-password-score';
export interface FormEditableData extends Pick<Credential, 'alternativeUsername' | 'email' | 'itemName' | 'linkedURLs' | 'note' | 'otpURL' | 'otpSecret' | 'password' | 'spaceId' | 'URL' | 'username'> {
    onlyAutofillExactDomain: boolean;
    requireMasterPassword: boolean;
    useAutoLogin: boolean;
}
export interface FormReadOnlyData extends Pick<Credential, 'id' | 'linkedURLs'> {
    limitedPermissions: boolean;
    isDiscontinuedUser?: boolean;
    forceCategorizedSpace?: PremiumStatusSpace | null;
}
export interface Props extends ProtectedItemsUnlockerProps {
    activeSpaces: PremiumStatusSpace[];
    dashlaneDefinedLinkedWebsites?: string[];
    readonlyValues: FormReadOnlyData;
    editableValues: FormEditableData;
    setEditableValues: Dispatch<SetStateAction<FormEditableData>>;
    signalEditedValues: (hasChanged: boolean) => void;
    isNewItem?: boolean;
    onClickAddNewWebsite?: () => void;
    setHasOpenedDialogs?: (value: boolean) => void;
}
export type CredentialFormRef = {
    isFormValid: () => boolean;
    getVaultItemCollections: () => FieldCollection[] | undefined;
};
const defaultGeneratorSettings: PasswordGenerationSettings = {
    length: 16,
    digits: true,
    letters: true,
    symbols: true,
    avoidAmbiguous: true,
};
const I18N_KEYS = {
    EMAIL: 'webapp_credential_edition_field_email',
    EMAIL_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_email',
    LOGIN: 'webapp_credential_edition_field_login',
    LOGIN_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_login',
    NAME: 'webapp_credential_edition_field_name',
    NAME_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_title',
    NOTE: 'webapp_credential_edition_field_note',
    NOTE_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_note',
    PASSWORD: 'webapp_credential_edition_field_password',
    PASSWORD_HIDE: 'webapp_credential_edition_field_password_action_hide',
    PASSWORD_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_password',
    PASSWORD_SHOW: 'webapp_credential_edition_field_password_action_show',
    SECONDARY_LOGIN: 'webapp_credential_edition_field_secondary_login',
    SECONDARY_LOGIN_PLACEHOLDER: 'webapp_credential_edition_field_placeholder_no_secondary_login',
    SPACE_TOOLTIP: 'webapp_credential_edition_field_force_categorized',
    GENERATE_PASSWORD_TOOLTIP: 'webapp_credential_edition_field_generator_generate_tooltip',
    CLOSE: '_common_dialog_dismiss_button',
    CALCULATING: 'webapp_credential_edition_field_generator_strength/none',
    TOO_GUESSABLE: 'webapp_credential_edition_field_generator_strength/weak',
    VERY_GUESSABLE: 'webapp_credential_edition_field_generator_strength/very_guessable',
    SOMEWHAT_GUESSABLE: 'webapp_credential_edition_field_generator_strength/somewhat_guessable',
    SAFELY_UNGUESSABLE: 'webapp_credential_edition_field_generator_strength/safely_unguessable',
    VERY_UNGUESSABLE: 'webapp_credential_edition_field_generator_strength/very_unguessable',
    LOGIN_DETAILS: 'webapp_credential_box_title_login_details',
    ORGANISATION: 'webapp_credential_box_title_organisation',
    PREFERENCES: 'webapp_credential_box_title_preferences',
};
const CredentialForm = forwardRef(({ activeSpaces, areProtectedItemsUnlocked, dashlaneDefinedLinkedWebsites, editableValues, isNewItem, onClickAddNewWebsite, openProtectedItemsUnlocker, readonlyValues, setEditableValues, setHasOpenedDialogs, signalEditedValues, }: Props, ref) => {
    const [internalProperties, setInternalProperties] = useState({
        showingPassword: false,
        showGeneratePassword: false,
        credentialsGloballyRequireMP: false,
        defaultSpaceId: editableValues.spaceId ?? '',
        generatorSettings: defaultGeneratorSettings,
    });
    const [passwordActions, setPasswordActions] = useState<JSX.Element[]>([]);
    const [itemNameManuallyUpdated, setItemNameManuallyUpdated] = useState(false);
    const { translate } = useTranslate();
    const collectionsFieldRef = useRef<CollectionsFieldRef>(null);
    const alert = useAlert();
    useImperativeHandle(ref, () => ({
        isFormValid: () => {
            return true;
        },
        getVaultItemCollections: () => {
            return collectionsFieldRef.current?.getVaultItemCollections();
        },
    }));
    const { data: passwordScore, status: passwordScoreStatus } = usePasswordScore(editableValues.password);
    useEffect(() => {
        Promise.all([
            carbonConnector.arePasswordsProtected(),
            carbonConnector.getPasswordGenerationSettings(),
        ]).then(([protectPasswords, settings]) => {
            setInternalProperties((prev) => ({
                ...prev,
                credentialsGloballyRequireMP: protectPasswords,
                generatorSettings: settings,
            }));
        });
    }, []);
    useEffect(() => {
        if (isNewItem && !itemNameManuallyUpdated) {
            setEditableValues((prev) => ({
                ...prev,
                itemName: capitalizedCredUrlDomainName(editableValues.URL),
            }));
        }
    }, [isNewItem, editableValues.URL]);
    const toggleGeneratePassword = () => {
        setInternalProperties((prev) => ({
            ...prev,
            showGeneratePassword: !prev.showGeneratePassword,
        }));
    };
    const isItemLocked = (): boolean | undefined => {
        if (!editableValues.password) {
            return false;
        }
        if (areProtectedItemsUnlocked === undefined) {
            return;
        }
        if (areProtectedItemsUnlocked) {
            return false;
        }
        return (editableValues.requireMasterPassword ||
            internalProperties.credentialsGloballyRequireMP);
    };
    const handleChange = (eventOrValue: React.ChangeEvent<any> | any, key = ''): void => {
        if (eventOrValue instanceof Event && key) {
            throw new Error('handleChange was called with both a ChangeEvent and key.');
        }
        if (!readonlyValues.limitedPermissions || key === 'spaceId') {
            const changedValues = eventOrValue?.target
                ? { [eventOrValue.target.dataset.name]: eventOrValue.target.value }
                : { [key]: eventOrValue };
            const keyName = Object.keys(changedValues)[0];
            setEditableValues({
                ...editableValues,
                [keyName]: changedValues[keyName],
            });
        }
    };
    let itemSpaceId = editableValues.spaceId;
    if (readonlyValues.forceCategorizedSpace?.teamName) {
        itemSpaceId = readonlyValues.forceCategorizedSpace?.teamId;
    }
    const currentSpace = activeSpaces?.find((space: PremiumStatusSpace) => space.teamId === itemSpaceId);
    const currentSpaceName = currentSpace?.teamName ??
        'webapp_credential_edition_field_space_personal';
    const handleSpaceChange = (newSpaceId: string) => {
        if (editableValues.spaceId === newSpaceId ||
            newSpaceId === internalProperties.defaultSpaceId) {
            return;
        }
        setInternalProperties((state) => ({
            ...state,
            defaultSpaceId: newSpaceId,
        }));
        collectionsFieldRef.current?.clearVaultItemCollections();
        handleChange(newSpaceId, 'spaceId');
    };
    const handleEditUsernameOrEmailForB2B = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (activeSpaces &&
            activeSpaces.length > 0 &&
            activeSpaces[0].info?.teamAdmins?.length > 0) {
            for (const domain of activeSpaces[0].info.teamAdmins) {
                if (event.target.value.includes(domain)) {
                    setInternalProperties({
                        ...internalProperties,
                        defaultSpaceId: activeSpaces[0].teamId ?? '',
                    });
                    break;
                }
            }
        }
    };
    const handleChanges = (changedValues: ChangedValues): void => {
        setEditableValues({ ...editableValues, ...changedValues });
    };
    const handlePasswordFocused = (event: React.FocusEvent<HTMLInputElement>) => {
        const shouldInterceptWithMP = !isNewItem && isItemLocked() && !internalProperties.showingPassword;
        if (shouldInterceptWithMP) {
            const { currentTarget } = event;
            const successCallback = () => {
                currentTarget?.focus();
            };
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.Password,
                showNeverAskOption: true,
                credentialId: readonlyValues.id,
                successCallback,
            });
        }
    };
    const toggleShowPassword = (showingPassword: boolean) => {
        if (showingPassword) {
            logRevealPassword(editableValues.URL, readonlyValues.id, editableValues.requireMasterPassword, internalProperties.credentialsGloballyRequireMP);
        }
        const shouldInterceptWithMP = !isNewItem && isItemLocked() && !internalProperties.showingPassword;
        if (shouldInterceptWithMP) {
            const successCallback = () => {
                setInternalProperties({
                    ...internalProperties,
                    showingPassword: true,
                });
            };
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.Password,
                showNeverAskOption: true,
                credentialId: readonlyValues.id,
                successCallback,
            });
        }
        else {
            setInternalProperties({
                ...internalProperties,
                showingPassword: showingPassword,
            });
        }
    };
    const isValueVisible = isValueFieldVisible(editableValues);
    useEffect(() => {
        handleSpaceChange(internalProperties.defaultSpaceId ?? '');
    }, [internalProperties]);
    const onCopyField = async (field: VaultItemField, success: boolean): Promise<void> => {
        const valuesURLRootDomain = new ParsedURL(editableValues.URL).getRootDomain();
        logEvent(new UserCopyVaultItemFieldEvent({
            itemType: ItemType.Credential,
            field,
            itemId: readonlyValues.id,
            isProtected: field === VaultItemField.Password
                ? !!editableValues.requireMasterPassword ||
                    !!internalProperties.credentialsGloballyRequireMP
                : false,
        }));
        logEvent(new AnonymousCopyVaultItemFieldEvent({
            itemType: ItemType.Credential,
            field,
            domain: {
                id: await hashDomain(valuesURLRootDomain),
                type: DomainType.Web,
            },
        }));
        if (!success) {
            alert.showAlert(translate('_common_generic_error'), AlertSeverity.ERROR);
        }
    };
    const onCopyEmailField = onCopyField.bind(this, VaultItemField.Email);
    const onCopyLoginField = onCopyField.bind(this, VaultItemField.Login);
    const onCopyOtpCodeField = onCopyField.bind(this, VaultItemField.OtpCode);
    const onCopyPasswordField = onCopyField.bind(this, VaultItemField.Password);
    const onCopySecondaryField = onCopyField.bind(this, VaultItemField.SecondaryLogin);
    useEffect(() => {
        let nextPasswordActions: JSX.Element[] = [];
        if (!isNewItem &&
            !readonlyValues.limitedPermissions &&
            editableValues.password) {
            nextPasswordActions = [
                <CopyToClipboardButton buttonId="copyPasswordButton" key="copy-password" itemId={readonlyValues.id} disabled={isItemLocked() === undefined} data={editableValues.password} checkProtected={isItemLocked} onCopy={onCopyPasswordField}/>,
                <PasswordChangeButton key="password-change" credential={{
                        id: readonlyValues.id,
                        limitedPermissions: readonlyValues.limitedPermissions,
                    }}/>,
            ];
        }
        else if ((!editableValues.password || !readonlyValues.isDiscontinuedUser) &&
            !internalProperties.showGeneratePassword) {
            nextPasswordActions = [
                <Button key="generate-password" aria-label={translate(I18N_KEYS.GENERATE_PASSWORD_TOOLTIP)} layout="iconOnly" mood="brand" intensity="supershy" onClick={toggleGeneratePassword} disabled={readonlyValues.limitedPermissions} icon="FeaturePasswordGeneratorOutlined" tooltip={translate(I18N_KEYS.GENERATE_PASSWORD_TOOLTIP)}/>,
            ];
        }
        setPasswordActions(nextPasswordActions);
    }, [
        isNewItem,
        readonlyValues.limitedPermissions,
        editableValues.password,
        areProtectedItemsUnlocked,
        internalProperties.credentialsGloballyRequireMP,
        internalProperties.showGeneratePassword,
    ]);
    const isInSharedCollection = Boolean(collectionsFieldRef.current
        ?.getVaultItemCollections()
        ?.some((collection: FieldCollection) => collection.isShared));
    const shouldDisableSpaceChange = Boolean(readonlyValues.forceCategorizedSpace) ||
        isInSharedCollection ||
        readonlyValues.isDiscontinuedUser;
    const setGeneratorSettings = (settings: PasswordGenerationSettings) => {
        setInternalProperties((prev) => ({
            ...prev,
            generatorSettings: settings,
        }));
    };
    return (<>
        <ContentCard title={translate(I18N_KEYS.LOGIN_DETAILS)} additionalSx={{ marginBottom: '16px' }}>
          {isNewItem ? (<CredentialCreationWebsitesComponent url={editableValues.URL} hasUrlError={false} handleMainWebsiteChange={handleChange} handleChanges={handleChanges} handleGoToWebsite={() => goToWebsite(readonlyValues.id, editableValues.URL)}/>) : null}
          {!isNewItem ? (<EmailField data-name="email" label={translate(I18N_KEYS.EMAIL)} placeholder={translate(I18N_KEYS.EMAIL_PLACEHOLDER)} readOnly={(!!editableValues.email &&
                readonlyValues.limitedPermissions) ||
                readonlyValues.isDiscontinuedUser} disabled={!editableValues.email && readonlyValues.limitedPermissions} value={editableValues.email} onChange={(event) => {
                handleChange(event);
                handleEditUsernameOrEmailForB2B(event);
            }} actions={[
                <CopyToClipboardButton key="copy-email" data={editableValues.email} onCopy={onCopyEmailField}/>,
            ]} sx={{ marginBottom: '8px' }}/>) : null}
          <TextField data-name="username" label={translate(I18N_KEYS.LOGIN)} placeholder={translate(I18N_KEYS.LOGIN_PLACEHOLDER)} readOnly={(!!editableValues.username &&
            readonlyValues.limitedPermissions) ||
            readonlyValues.isDiscontinuedUser} disabled={!editableValues.username && readonlyValues.limitedPermissions} value={editableValues.username} onChange={(event) => {
            handleChange(event);
            handleEditUsernameOrEmailForB2B(event);
        }} actions={!isNewItem && Boolean(editableValues.username)
            ? [
                <CopyToClipboardButton key="copy-login" data={editableValues.username} onCopy={onCopyLoginField}/>,
            ]
            : undefined} sx={{ marginBottom: '8px' }}/>
          {isValueVisible(Field.SECONDARY_LOGIN, editableValues.alternativeUsername) ? (<TextField data-name="alternativeUsername" label={translate(I18N_KEYS.SECONDARY_LOGIN)} placeholder={translate(I18N_KEYS.SECONDARY_LOGIN_PLACEHOLDER)} value={editableValues.alternativeUsername} readOnly={!!editableValues.alternativeUsername &&
                (readonlyValues.limitedPermissions ||
                    readonlyValues.isDiscontinuedUser)} disabled={!editableValues.alternativeUsername &&
                (readonlyValues.limitedPermissions ||
                    readonlyValues.isDiscontinuedUser)} onChange={handleChange} actions={editableValues.alternativeUsername
                ? [
                    <CopyToClipboardButton key="copy-secondary-login" data={editableValues.alternativeUsername} onCopy={onCopySecondaryField}/>,
                ]
                : undefined} sx={{ marginBottom: '8px' }}/>) : null}

          <PasswordField id="password" data-name="password" label={translate(I18N_KEYS.PASSWORD)} placeholder={translate(I18N_KEYS.PASSWORD_PLACEHOLDER)} toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.PASSWORD_HIDE),
            show: translate(I18N_KEYS.PASSWORD_SHOW),
        }} value={editableValues.password} disabled={!isNewItem && readonlyValues.limitedPermissions} readOnly={(!isNewItem && isItemLocked()) ||
            readonlyValues.isDiscontinuedUser} onFocus={handlePasswordFocused} onChange={handleChange} onPasswordVisibilityChange={toggleShowPassword} actions={passwordActions} passwordStrength={editableValues.password &&
            passwordScore !== undefined &&
            passwordScoreStatus === DataStatus.Success
            ? {
                score: passwordScore,
                description: {
                    NoScore: translate(I18N_KEYS.CALCULATING),
                    TooGuessable: translate(I18N_KEYS.TOO_GUESSABLE),
                    VeryGuessable: translate(I18N_KEYS.VERY_GUESSABLE),
                    SomewhatGuessable: translate(I18N_KEYS.SOMEWHAT_GUESSABLE),
                    SafelyUnGuessable: translate(I18N_KEYS.SAFELY_UNGUESSABLE),
                    VeryUnGuessable: translate(I18N_KEYS.VERY_UNGUESSABLE),
                },
                descriptionId: passwordScore.toString(),
            }
            : undefined}/>
          {internalProperties.showGeneratePassword ? (<GeneratePasswordCard generatorSettings={internalProperties.generatorSettings} setGeneratorSettings={setGeneratorSettings} handleChangePassword={(newPassword) => {
                handleChange(newPassword, 'password');
            }} handleClose={toggleGeneratePassword}/>) : null}
          <CredentialOtpField secretOrUrl={editableValues.otpURL || editableValues.otpSecret || ''} isEditable={!readonlyValues.limitedPermissions} url={editableValues.URL} title={editableValues.itemName} onCopy={onCopyOtpCodeField} onSubmit={(value) => handleChange(value, 'otpUrl')} setHasOpenedDialogs={setHasOpenedDialogs}/>
          {!isNewItem ? (<CredentialEditionWebsitesComponent url={editableValues.URL} linkedWebsitesAddedByUser={readonlyValues.linkedURLs.length > 0
                ? readonlyValues.linkedURLs
                : editableValues.linkedURLs} dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsites} hasUrlError={false} editViewButtonEnabled={!isNewItem && Boolean(editableValues.URL)} limitedPermissions={readonlyValues.limitedPermissions} handleChange={handleChange} handleGoToWebsite={() => goToWebsite(readonlyValues.id, editableValues.URL)} onClickAddNewWebsite={onClickAddNewWebsite} isWebsiteFieldReadonly={readonlyValues.isDiscontinuedUser ||
                readonlyValues.limitedPermissions}/>) : null}
          <TextArea data-name="note" test-id="credential_edit_note_value" label={translate(I18N_KEYS.NOTE)} placeholder={translate(I18N_KEYS.NOTE_PLACEHOLDER)} value={editableValues.note} disabled={readonlyValues.limitedPermissions ||
            readonlyValues.isDiscontinuedUser} onChange={handleChange} sx={{ marginTop: '8px' }}/>
        </ContentCard>

        <ContentCard title={translate(I18N_KEYS.ORGANISATION)} additionalSx={{ marginBottom: '16px' }}>
          <TextField data-name="itemName" label={translate(I18N_KEYS.NAME)} placeholder={translate(I18N_KEYS.NAME_PLACEHOLDER)} value={editableValues.itemName} readOnly={!!editableValues.itemName &&
            (readonlyValues.limitedPermissions ||
                readonlyValues.isDiscontinuedUser)} disabled={!editableValues.itemName &&
            (readonlyValues.limitedPermissions ||
                readonlyValues.isDiscontinuedUser)} onChange={(event) => {
            if (!itemNameManuallyUpdated) {
                setItemNameManuallyUpdated(true);
            }
            handleChange(event);
        }} sx={{ marginBottom: '8px' }}/>

          <Tooltip content={translate(I18N_KEYS.SPACE_TOOLTIP, {
            space: currentSpaceName,
        })} passThrough={!shouldDisableSpaceChange}>
            <div>
              <SpaceSelect spaceId={editableValues.spaceId ?? ''} disabled={shouldDisableSpaceChange} onChange={handleSpaceChange} defaultSpaceId={internalProperties.defaultSpaceId ?? ''} isUsingNewDesign/>
            </div>
          </Tooltip>

          <CollectionsField hasLabel={false} spaceId={editableValues.spaceId ?? ''} vaultItemId={readonlyValues.id} vaultItemTitle={editableValues.itemName} ref={collectionsFieldRef} signalEditedValues={signalEditedValues} setHasOpenedDialogs={setHasOpenedDialogs} isAddCollectionDisabled={readonlyValues.isDiscontinuedUser}/>
        </ContentCard>

        <ContentCard title={translate(I18N_KEYS.PREFERENCES)}>
          <CredentialPreferences isNewCredential={!!isNewItem} credentialPreferences={{
            useAutoLogin: editableValues.useAutoLogin,
            requireMasterPassword: !!editableValues.requireMasterPassword,
            onlyAutofillExactDomain: !!editableValues.onlyAutofillExactDomain,
        }} update={(preferences) => {
            handleChanges({
                useAutoLogin: preferences.useAutoLogin,
                requireMasterPassword: preferences.requireMasterPassword,
                onlyAutofillExactDomain: preferences.onlyAutofillExactDomain,
            });
            return Promise.resolve();
        }} isPreferenceDisabled={readonlyValues.isDiscontinuedUser} url={editableValues.URL}/>
        </ContentCard>
      </>);
});
CredentialForm.displayName = 'CredentialForm';
export { CredentialForm };
