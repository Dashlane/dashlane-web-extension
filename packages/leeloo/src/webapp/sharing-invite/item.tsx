import { CredentialDetailView, CredentialItemView, NoteItemView, UserGroupDownload, } from '@dashlane/communication';
import { useFeatureFlips, useModuleQuery } from '@dashlane/framework-react';
import { SharedCollectionRole, sharingItemsApi, } from '@dashlane/sharing-contracts';
import { Checkbox, FlexContainer, jsx, mergeSx, ThemeUIStyleObject, Thumbnail, } from '@dashlane/ui-components';
import { Secret, SecureNote } from '@dashlane/vault-contracts';
import { getBackgroundColor } from 'libs/dashlane-style/credential-info/getBackgroundColor';
import { DetailedItem, DetailedItemParams, } from 'libs/dashlane-style/detailed-item';
import { NoteIcon } from 'webapp/note-icon';
import { isItemACredential, isItemANote, } from 'webapp/sharing-center/shared/items-list/util';
import { CollectionSharingRoles } from './recipients/sharing-collection-recipients';
import { SharingInviteItemSelect } from './sharing-invite-item-select';
import searchIcon from './svg/search.svg';
import SecuredIcon from './svg/secured-misc.svg?inline';
import SharedIcon from './svg/shared-status-misc.svg?inline';
interface ItemProps extends DetailedItemParams {
    checked: boolean;
    id?: string;
    item?: SecureNote | CredentialItemView | NoteItemView | Secret | UserGroupDownload;
    freeLimitReached?: boolean;
    onCheck?: (checked: boolean) => void;
    onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
    roles?: CollectionSharingRoles[];
    style?: React.CSSProperties;
    canShareCollection?: boolean;
    isStarterAdmin?: boolean;
}
export const SHARING_INVITE_CONTENT_HEIGHT = 'calc(100vh - 68px - 108px - 80px)';
export const itemSx: ThemeUIStyleObject = {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'ds.border.neutral.quiet.idle',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '56px',
    position: 'relative',
    backgroundColor: 'ds.background.default',
    ':last-of-type': {
        borderBottom: 'none',
    },
};
const disabledItemSx: ThemeUIStyleObject = {
    opacity: 0.5,
    cursor: 'auto',
};
const EDITOR_MANAGER_FEATURE_FLIP_DEV = 'sharingVault_web_Collection_Editor_Manager_dev';
const EDITOR_MANAGER_FEATURE_FLIP_PROD = 'sharingVault_web_Collection_Editor_Manager_prod';
export const ItemNotFound = ({ text }: {
    text: string;
}) => {
    return (<FlexContainer justifyContent="space-around" alignItems="center" sx={{
            height: '100%',
            minHeight: '347px',
        }}>
      <FlexContainer justifyContent="space-around" alignItems="center" flexDirection="column" sx={{
            maxWidth: '400px',
        }}>
        <img src={searchIcon}/>
        <span sx={{
            color: 'ds.text.neutral.quiet',
            marginTop: '20px',
            lineHeight: '20px',
            textAlign: 'center',
        }}>
          {text}
        </span>
      </FlexContainer>
    </FlexContainer>);
};
export function getCredentialLogo(itemContent: CredentialItemView | CredentialDetailView) {
    const { title, domainIcon } = itemContent;
    const iconSource = domainIcon?.urls['46x30@2x'] ?? undefined;
    const backgroundColor = getBackgroundColor({
        backgroundColor: domainIcon?.backgroundColor,
        mainColor: domainIcon?.mainColor,
        iconSource,
    });
    return (<Thumbnail size="small" text={title} iconSource={iconSource} backgroundColor={backgroundColor}/>);
}
export function getNoteLogo(itemContent: SecureNote) {
    return <NoteIcon noteType={itemContent.color}/>;
}
const titleIconSx = {
    marginLeft: '4px',
    path: {
        fill: 'ds.text.neutral.quiet',
    },
};
export const getTitleLogo = (isShared: boolean, isSecured: boolean): React.ReactNode => (<span sx={{ display: 'flex', alignItems: 'center' }}>
    {isShared && <SharedIcon sx={titleIconSx}/>}
    {isSecured && <SecuredIcon sx={titleIconSx}/>}
  </span>);
export const Item = (props: ItemProps) => {
    const { id, checked, roles, onCheck, onRolesChanged, style, item, freeLimitReached, canShareCollection, isStarterAdmin, ...itemContentParams } = props;
    const retrievedFeatureFlips = useFeatureFlips();
    const isEditorManagerRoleEnabled = Boolean(retrievedFeatureFlips.data?.[EDITOR_MANAGER_FEATURE_FLIP_DEV] ||
        retrievedFeatureFlips.data?.[EDITOR_MANAGER_FEATURE_FLIP_PROD]);
    const { data: sharingData } = useModuleQuery(sharingItemsApi, 'getSharingStatusForItem', {
        itemId: item && (isItemANote(item) || isItemACredential(item))
            ? (item?.id as string)
            : '',
    });
    const isSecured = !!item &&
        (isItemANote(item)
            ? item?.isSecured
            : isItemACredential(item)
                ? item?.autoProtected
                : false);
    const titleLogo = getTitleLogo(sharingData?.isShared ?? false, isSecured);
    const disabled = canShareCollection === false ||
        (!!item &&
            (isItemANote(item) || isItemACredential(item)
                ? freeLimitReached && !checked && !sharingData?.isShared
                : false));
    const handleCheck = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onCheck?.(evt.currentTarget.checked);
        if (id && roles && onRolesChanged) {
            const updatedRoles = [...roles];
            updatedRoles.push({ id, role: SharedCollectionRole.Editor });
            onRolesChanged(updatedRoles);
        }
    };
    const shouldRenderSharingInviteItemSelect = checked && isEditorManagerRoleEnabled && roles && onRolesChanged && id;
    return (<li sx={disabled ? mergeSx([itemSx, disabledItemSx]) : itemSx} style={style}>
      <Checkbox checked={checked} disabled={disabled} onChange={handleCheck} label={<DetailedItem {...itemContentParams} titleLogo={titleLogo}/>}/>
      {shouldRenderSharingInviteItemSelect && (<SharingInviteItemSelect id={id} roles={roles} onRolesChanged={onRolesChanged} isStarterAdmin={isStarterAdmin}/>)}
    </li>);
};
