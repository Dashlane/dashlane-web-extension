import React, { useRef } from "react";
import { VaultItem } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SectionCard } from "./components/section-card";
import { SectionList } from "./section-list";
import { SectionListHeader } from "./section-list-header/section-list-header";
interface AdditionalItemComponentProps<T extends VaultItem> {
  item: T;
}
interface VaultItemsListProps<
  T extends VaultItem,
  ItemComponentProps extends AdditionalItemComponentProps<T>
> {
  ItemComponent: React.ComponentType<ItemComponentProps>;
  itemComponentProps?: Omit<
    ItemComponentProps,
    keyof AdditionalItemComponentProps<T>
  >;
  items: T[];
  titleKey: string;
  totalItemsCount: number;
}
export const VaultItemsList = <
  T extends VaultItem,
  ItemComponentProps extends AdditionalItemComponentProps<T>
>({
  items,
  totalItemsCount,
  titleKey,
  ItemComponent,
  itemComponentProps,
}: VaultItemsListProps<T, ItemComponentProps>) => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { translate } = useTranslate();
  if (totalItemsCount <= 0) {
    return null;
  }
  return (
    <SectionCard>
      <section ref={containerRef}>
        <SectionListHeader headerRef={headerRef} itemsCount={totalItemsCount}>
          {translate(titleKey)}
        </SectionListHeader>
        <SectionList headerRef={headerRef} containerRef={containerRef}>
          {items.map((item) => (
            <ItemComponent
              {...(itemComponentProps as ItemComponentProps)}
              item={item}
              key={item.id}
            />
          ))}
        </SectionList>
      </section>
    </SectionCard>
  );
};
