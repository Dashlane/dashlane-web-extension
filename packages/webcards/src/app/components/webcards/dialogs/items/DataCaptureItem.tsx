import * as React from "react";
import { Checkbox } from "@dashlane/ui-components";
import {
  Icon,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { DataCaptureWebcardItem } from "@dashlane/autofill-engine/dist/autofill-engine/src/Api/types/data-capture";
import { COMMON_SX_STYLES } from "../../../../../styles";
import { vaultSourceTypeKeyMap } from "../../../../utils/formatter/keys";
import { getIconName } from "../../../common/icons/icons";
import { I18nContext } from "../../../../context/i18n";
import styles from "./DataCaptureItem.module.scss";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  TITLE: mergeSx([
    COMMON_SX_STYLES.FOOTNOTE_TEXT,
    {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
  ]),
};
export interface Props {
  id: number;
  item: DataCaptureWebcardItem;
  checked: boolean;
  onClick: (isChecked: boolean) => void;
}
export const DataCaptureItem = ({ id, item, checked, onClick }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const toggleCheckbox = () => onClick(!checked);
  const iconName = getIconName(item.type);
  const itemTitle = vaultSourceTypeKeyMap[item.type]
    ? translate(`types_${vaultSourceTypeKeyMap[item.type]}`)
    : "";
  return (
    <label id={`DataCaptureItem-${id}`} className={styles.item}>
      {iconName ? (
        <div className={styles.img}>
          <Icon name={iconName} aria-label={item.type} size="large" />
        </div>
      ) : null}
      <div className={styles.text}>
        <div className={styles.content}>{item.content}</div>
        <div sx={SX_STYLES.TITLE}>{itemTitle}</div>
      </div>
      <Checkbox checked={checked} onChange={toggleCheckbox} />
    </label>
  );
};
