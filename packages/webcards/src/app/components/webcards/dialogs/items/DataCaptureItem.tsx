import * as React from "react";
import {
  Checkbox,
  ItemHeader,
  jsx,
  ListItem,
  VaultItemThumbnail,
} from "@dashlane/design-system";
import { DataCaptureWebcardItem } from "@dashlane/autofill-engine/types";
import { vaultSourceTypeKeyMap } from "../../../../utils/formatter/keys";
import { getThumbnailName } from "../../../common/icons/icons";
import { I18nContext } from "../../../../context/i18n";
export interface Props {
  id: number;
  item: DataCaptureWebcardItem;
  checked: boolean;
  onClick: (isChecked: boolean) => void;
}
export const DataCaptureItem = ({ id, item, checked, onClick }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const toggleCheckbox = () => onClick(!checked);
  const iconName = getThumbnailName(item.type);
  const itemTitle = vaultSourceTypeKeyMap[item.type]
    ? translate(`types_${vaultSourceTypeKeyMap[item.type]}`)
    : "";
  return (
    <ListItem
      aria-label={itemTitle}
      onClick={toggleCheckbox}
      checkboxSlot={
        <Checkbox
          id={`DataCaptureItem-${id}`}
          aria-label={itemTitle}
          checked={checked}
          onChange={toggleCheckbox}
        />
      }
    >
      <ItemHeader
        thumbnail={<VaultItemThumbnail type={iconName ? iconName : "name"} />}
        title={item.content}
        description={itemTitle}
        sx={{ overflow: "hidden" }}
      />
    </ListItem>
  );
};
