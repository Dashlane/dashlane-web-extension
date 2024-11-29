import * as React from "react";
import styles from "./styles.css";
const classnames = require("classnames");
export interface DetailedItemParams {
  infoAction?: React.ReactNode;
  logo: React.ReactNode;
  text?: string;
  title: string;
  titleLogo?: React.ReactNode;
  disabled?: boolean;
  permissionBadge?: JSX.Element;
}
export const DetailedItem = (content: DetailedItemParams) => {
  const {
    title,
    text,
    logo,
    infoAction,
    titleLogo,
    disabled,
    permissionBadge,
  } = content;
  const detailedItemClassName = classnames(styles.detailedItem, {
    [styles.disabled]: disabled,
  });
  return (
    <div className={detailedItemClassName}>
      <div className={styles.detailedItemDetails}>
        <div className={styles.detailedItemLogo}>{logo}</div>
        <div className={styles.itemDetails}>
          <div className={styles.itemTitle}>
            <div
              className={styles.itemTitleText}
              sx={{
                color: "ds.text.neutral.catchy",
                variant: "text.ds.body.standard.regular",
                lineHeight: "20px",
                flexShrink: 10000,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
            {titleLogo && (
              <div className={styles.itemTitleLogo}>{titleLogo}</div>
            )}
          </div>
          {text && (
            <div
              sx={{
                color: "ds.text.neutral.quiet",
                variant: "text.ds.body.helper.regular",
                lineHeight: "16px",
              }}
            >
              {text}
            </div>
          )}
          {permissionBadge ? permissionBadge : null}
        </div>
      </div>
      {infoAction && (
        <div className={styles.detailedItemInfoAction}>{infoAction}</div>
      )}
    </div>
  );
};
