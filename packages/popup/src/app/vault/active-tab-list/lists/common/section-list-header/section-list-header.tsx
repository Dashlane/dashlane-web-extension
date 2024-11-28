import * as React from "react";
import { jsx, Paragraph, ThemeUIStyleObject } from "@dashlane/design-system";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CREDENTIAL_COUNT: "tab/all_items/credential_count",
  CREDENTIAL_ONE_ITEM: "tab/all_items/credential_one_item",
};
interface Props {
  itemsCount: number;
  headerRef: React.RefObject<HTMLDivElement>;
}
const SX_STYLES: ThemeUIStyleObject = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: "O",
  zIndex: "1",
  margin: "8px",
};
export const SectionListHeader = ({
  itemsCount,
  children,
}: React.PropsWithChildren<Props>) => {
  const { translate } = useTranslate();
  const getItemsCountTranslation = (): string => {
    if (itemsCount <= 0) {
      return "";
    }
    if (itemsCount === 1) {
      return translate(I18N_KEYS.CREDENTIAL_ONE_ITEM);
    }
    return translate(I18N_KEYS.CREDENTIAL_COUNT, { count: itemsCount });
  };
  const itemsCountTranslation = getItemsCountTranslation();
  return (
    <div sx={SX_STYLES}>
      <Paragraph
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {children}
      </Paragraph>

      <Paragraph
        textStyle="ds.body.helper.regular"
        color="ds.text.neutral.quiet"
      >
        {itemsCountTranslation !== "" ? (
          <span>{itemsCountTranslation}</span>
        ) : null}
      </Paragraph>
    </div>
  );
};
