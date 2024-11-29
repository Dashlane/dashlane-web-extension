import React, { useCallback, useEffect, useRef, useState } from "react";
import Clipboard from "clipboard";
import { FamilyStatusCode } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { CopyButton } from "../copy-button/copy-button";
import styles from "./styles.css";
import copyButtonStyles from "../copy-button/styles.css";
const I18N_KEYS = {
  TITLE: "webapp_family_dashboard_link_title",
  DESCRIPTION: "webapp_family_dashboard_link_description",
  COPY_LINK: "webapp_family_dashboard_link_copy",
  SPOTS: "webapp_family_dashboard_spots_markup",
};
const LINK_COPY_TIMEOUT = 3000;
interface FamilyHeaderProps {
  spots: number;
  invitationLink: string;
  statusCode: FamilyStatusCode;
}
export const FamilyHeader = ({
  spots,
  invitationLink,
  statusCode,
}: FamilyHeaderProps) => {
  const { translate } = useTranslate();
  const linkInputEl = useRef<HTMLInputElement>(null);
  const [isLinkCopied, setLinkCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const onCopy = useCallback(() => {
    setLinkCopied(true);
    const id = window.setTimeout(() => setLinkCopied(false), LINK_COPY_TIMEOUT);
    setTimeoutId(id);
  }, [statusCode]);
  useEffect(() => {
    new Clipboard(`.${copyButtonStyles.copyButton}`, {
      text: () => invitationLink,
    });
  }, [invitationLink]);
  useEffect(() => {
    return () => {
      if (timeoutId) {
        return clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  const selectInputLink = () => {
    if (linkInputEl && linkInputEl.current) {
      linkInputEl.current.select();
    }
  };
  return (
    <header className={styles.familyHeader}>
      <h1 className={styles.title}>{translate(I18N_KEYS.TITLE)}</h1>
      <div className={styles.headerContent}>
        <div className={styles.linkContainer}>
          <p className={styles.description}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </p>
          <div className={styles.linkInputContainer}>
            <input
              aria-label={translate(I18N_KEYS.COPY_LINK)}
              className={styles.link}
              readOnly
              value={invitationLink}
              ref={linkInputEl}
              onClick={selectInputLink}
            />
            <CopyButton isLinkCopied={isLinkCopied} onClick={onCopy} />
          </div>
        </div>
        <div className={styles.spotsContainer}>
          {translate.markup(I18N_KEYS.SPOTS, { count: spots })}
        </div>
      </div>
    </header>
  );
};
