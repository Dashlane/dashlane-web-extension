import React, { useRef } from 'react';
import { VaultItem } from '@dashlane/vault-contracts';
import useTranslate from 'src/libs/i18n/useTranslate';
import { SectionListHeader } from './section-list-header/section-list-header';
import { useListKeyboardNavContext } from './list-keyboard-nav-context';
interface AdditionalItemComponentProps<T extends VaultItem> {
    item: T;
    listContainerRef: React.RefObject<HTMLElement>;
    listHeaderRef: React.RefObject<HTMLDivElement>;
}
interface VaultItemsListProps<T extends VaultItem, ItemComponentProps extends AdditionalItemComponentProps<T>> {
    ItemComponent: React.ComponentType<ItemComponentProps>;
    itemComponentProps?: Omit<ItemComponentProps, keyof AdditionalItemComponentProps<T>>;
    items: T[];
    titleKey: string;
    totalItemsCount: number;
}
export const VaultItemsList = <T extends VaultItem, ItemComponentProps extends AdditionalItemComponentProps<T>>({ items, totalItemsCount, titleKey, ItemComponent, itemComponentProps, }: VaultItemsListProps<T, ItemComponentProps>) => {
    const { onKeyDown } = useListKeyboardNavContext();
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { translate } = useTranslate();
    if (totalItemsCount <= 0) {
        return null;
    }
    return (<section ref={containerRef}>
      <SectionListHeader headerRef={headerRef} itemsCount={totalItemsCount}>
        {translate(titleKey)}
      </SectionListHeader>
      <ul onKeyDown={onKeyDown}>
        {items.map((item) => (<ItemComponent {...(itemComponentProps as ItemComponentProps)} item={item} key={item.id} listContainerRef={containerRef} listHeaderRef={headerRef}/>))}
      </ul>
    </section>);
};
