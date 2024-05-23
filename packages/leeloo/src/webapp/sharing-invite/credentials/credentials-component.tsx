import React, { ReactNode } from 'react';
import { CredentialItemView } from '@dashlane/communication';
import { InfiniteScroll } from 'libs/pagination/infinite-scroll';
import { InjectedProps as PaginationProps } from 'libs/pagination/consumer';
import { getCredentialLogo, getTitleLogo, Item, ItemNotFound, } from 'webapp/sharing-invite/item';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    NO_CREDENTIALS: 'webapp_sharing_invite_no_credentials_found',
    NO_SELECTED: 'webapp_sharing_invite_no_selected_credentials_found',
};
export interface Props extends PaginationProps<CredentialItemView> {
    freeLimitReached: boolean;
    onCheckCredential: (id: string, checked: boolean) => void;
    selectedCredentials: string[];
    elementsOnlyShowSelected: boolean;
}
export const CredentialsListComponent = (props: Props) => {
    const { paginatedData, freeLimitReached, onCheckCredential, selectedCredentials, elementsOnlyShowSelected, } = props;
    const { translate } = useTranslate();
    const renderNoCredentialsFound = (): JSX.Element => {
        const copy = elementsOnlyShowSelected
            ? translate(I18N_KEYS.NO_SELECTED)
            : translate(I18N_KEYS.NO_CREDENTIALS);
        return <ItemNotFound text={copy}/>;
    };
    const renderCredential = (credential: CredentialItemView, index: number): ReactNode => {
        if (!credential) {
            return null;
        }
        const logo = getCredentialLogo(credential);
        const { id, title, email, login } = credential;
        const { isShared } = credential.sharingSatus;
        const titleLogo = getTitleLogo(isShared, credential.autoProtected);
        const text = email || login;
        const onCheck = (isChecked: boolean) => onCheckCredential(id, isChecked);
        const checked = selectedCredentials.includes(credential.id);
        const disabled = freeLimitReached && !checked && !isShared;
        return (<Item key={index} {...{
            title,
            text,
            logo,
            onCheck,
            checked,
            disabled,
            titleLogo,
            item: credential,
        }}/>);
    };
    const renderBatch = ([key, items]: [
        string,
        CredentialItemView[]
    ]) => {
        return (<li key={key}>
        <ul>{items.map((item, index) => renderCredential(item, index))}</ul>
      </li>);
    };
    const hasNoData = paginatedData.size === 1 && [...paginatedData.values()][0].length === 0;
    if (hasNoData && !props.hasNext) {
        return renderNoCredentialsFound();
    }
    return (<InfiniteScroll hasNext={props.hasNext} hasPrevious={props.hasPrevious} isLoading={props.isLoading} loadNext={props.loadNext} loadPrevious={props.loadPrevious}>
      {[...paginatedData].map(renderBatch)}
    </InfiniteScroll>);
};
