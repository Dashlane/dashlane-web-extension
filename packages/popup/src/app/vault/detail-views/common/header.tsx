import { ReactNode } from "react";
import { Button, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./header.css";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  HEADER_CONTAINER: {
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    padding: "24px",
    color: "ds.text.neutral.catchy",
    backgroundColor: "ds.container.agnostic.neutral.quiet",
  },
};
interface HeaderProps {
  Icon?: ReactNode;
  title?: string;
  onEdit: () => void;
  onClose: () => void;
}
const I18N_KEYS = {
  CLOSE: "tab/all_items/credential/view/action/close",
  EDIT: "tab/all_items/credential/view/action/edit",
};
export const Header = ({ Icon, title, onEdit, onClose }: HeaderProps) => {
  const { translate } = useTranslate();
  return (
    <header sx={SX_STYLES.HEADER_CONTAINER}>
      <Button
        icon="ArrowLeftOutlined"
        layout="iconOnly"
        mood="neutral"
        intensity="supershy"
        onClick={onClose}
        sx={{
          display: "flex",
          height: "fit-content",
        }}
        aria-label={translate(I18N_KEYS.CLOSE)}
      />

      <div className={styles.contentColumn} role="heading" aria-level={1}>
        {Icon && Icon}
        {title && <span className={styles.title}>{title}</span>}
      </div>

      <Button
        role="link"
        icon="ActionEditOutlined"
        layout="iconOnly"
        mood="neutral"
        intensity="supershy"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEdit();
        }}
        sx={{
          display: "flex",
          height: "fit-content",
        }}
        aria-label={translate(I18N_KEYS.EDIT)}
      />
    </header>
  );
};
