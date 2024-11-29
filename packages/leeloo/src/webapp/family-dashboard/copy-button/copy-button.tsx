import React from "react";
import { Button, CheckIcon, colors, LinkIcon } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  COPY_LINK: "webapp_family_dashboard_link_copy",
  LINK_COPIED: "webapp_family_dashboard_link_copied",
};
interface CopyButtonProps {
  onClick?: () => void;
  isLinkCopied: boolean;
}
export const CopyButton = ({ onClick, isLinkCopied }: CopyButtonProps) => {
  const { translate } = useTranslate();
  return (
    <Button
      type="button"
      nature="primary"
      size="large"
      className={isLinkCopied ? styles.copiedButton : styles.copyButton}
      disabled={isLinkCopied}
      onClick={onClick}
    >
      <div className={styles.icon}>
        {isLinkCopied ? (
          <CheckIcon color={colors.white} />
        ) : (
          <LinkIcon color={colors.white} />
        )}
      </div>
      {translate(isLinkCopied ? I18N_KEYS.LINK_COPIED : I18N_KEYS.COPY_LINK)}
    </Button>
  );
};
