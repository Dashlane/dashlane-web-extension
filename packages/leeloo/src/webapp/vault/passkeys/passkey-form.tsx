import { ChangeEvent, Fragment, useEffect } from 'react';
import { jsx, Tooltip } from '@dashlane/design-system';
import { PremiumStatusSpace } from '@dashlane/communication';
import { DomainType, ItemTypeWithLink, PageView, UserOpenExternalVaultItemLinkEvent, } from '@dashlane/hermes';
import { Passkey } from '@dashlane/vault-contracts';
import { ParsedURL } from '@dashlane/url-parser';
import DetailField from 'libs/dashlane-style/detail-field';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { MainWebsiteField } from 'webapp/credentials/form/websites/main-website-field';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
const I18N_KEYS = {
    USERNAME: 'webapp_passkey_edition_field_username',
    USERNAME_PLACEHOLDER: 'webapp_passkey_edition_field_username_placeholder',
    ITEM_NAME: 'webapp_passkey_edition_field_item_name',
    ITEM_NAME_PLACEHOLDER: 'webapp_passkey_edition_field_item_name_placeholder',
    FIELD_NOTES: 'webapp_passkey_edition_field_notes',
    FIELD_PLACEHOLDER_NO_NOTES: 'webapp_passkey_edition_field_placeholder_no_notes',
    SPACE_TOOLTIP: 'webapp_passkey_edition_field_force_categorized',
    SPACE_PERSONAL: 'webapp_credential_edition_field_space_personal',
};
export interface PasskeyFormProps {
    passkeyContent: Passkey;
    spaceDetails: PremiumStatusSpace | null;
    signalEditedValues: (newPasskeyContent: Passkey) => void;
}
export const PasskeyForm = ({ passkeyContent, spaceDetails, signalEditedValues, }: PasskeyFormProps) => {
    const { translate } = useTranslate();
    const currentSpaceName = spaceDetails?.teamName ?? translate(I18N_KEYS.SPACE_PERSONAL);
    const { userDisplayName, rpId, itemName, note, spaceId, id } = passkeyContent;
    useEffect(() => {
        logPageView(PageView.ItemPasskeyDetails);
    }, []);
    const handleWebsiteChange = (eventOrValue: ChangeEvent<any> | any, key = ''): void => {
        if (eventOrValue instanceof Event && key) {
            throw new Error('handleChange was called with both a ChangeEvent and key.');
        }
    };
    const handleContentChanged = (field: keyof Passkey) => (eventOrValue: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
        const updatedValue = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value;
        signalEditedValues({
            ...passkeyContent,
            [field]: updatedValue,
        });
    };
    const shouldDisableSpaceChange = Boolean(spaceDetails?.info.forcedDomainsEnabled &&
        passkeyContent.spaceId === spaceDetails?.teamId);
    return (<>
      <div sx={{ marginBottom: '32px' }}>
        <DetailField key="passkeyUsername" disabled value={userDisplayName} label={translate(I18N_KEYS.USERNAME)} placeholder={translate(I18N_KEYS.USERNAME_PLACEHOLDER)}/>
        <MainWebsiteField url={rpId} hasUrlError={false} disabled editViewButtonEnabled={true} isWebsiteFieldReadonly={false} handleChange={handleWebsiteChange} handleGoToWebsite={() => {
            logEvent(new UserOpenExternalVaultItemLinkEvent({
                itemId: id,
                itemType: ItemTypeWithLink.Passkey,
                domainType: DomainType.Web,
            }));
            openUrl(new ParsedURL(rpId).getUrlWithFallbackHttpsProtocol());
        }}/>
      </div>

      <DetailField key="passkeyItemName" value={itemName ?? userDisplayName} onChange={handleContentChanged('itemName')} label={translate(I18N_KEYS.ITEM_NAME)} placeholder={translate(I18N_KEYS.ITEM_NAME_PLACEHOLDER)}/>
      <Tooltip content={translate(I18N_KEYS.SPACE_TOOLTIP, {
            space: currentSpaceName,
        })} passThrough={!shouldDisableSpaceChange}>
        <div>
          <SpaceSelect spaceId={spaceId} labelSx={spaceSelectFormLabelSx} isDisabled={shouldDisableSpaceChange} onChange={(newSpaceId) => handleContentChanged('spaceId')(newSpaceId)}/>
        </div>
      </Tooltip>
      <DetailField label={translate(I18N_KEYS.FIELD_NOTES)} placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER_NO_NOTES)} dataName="note" value={note} onChange={handleContentChanged('note')} multiLine={true}/>
    </>);
};
