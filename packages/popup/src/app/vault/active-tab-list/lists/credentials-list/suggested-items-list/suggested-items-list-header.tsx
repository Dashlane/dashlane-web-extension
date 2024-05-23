import React, { RefObject } from 'react';
import useTranslate from 'src/libs/i18n/useTranslate';
import { SectionListHeader } from '../../common/section-list-header/section-list-header';
const I18N_KEYS = {
    TITLE: 'tab/all_items/suggested_item_section/title',
};
interface SuggestedItemsListHeaderProps {
    headerRef: RefObject<HTMLDivElement>;
}
export const SuggestedItemsListHeader = ({ headerRef, }: SuggestedItemsListHeaderProps) => {
    const { translate } = useTranslate();
    return (<SectionListHeader headerRef={headerRef} itemsCount={0}>
      {translate(I18N_KEYS.TITLE)}
    </SectionListHeader>);
};
