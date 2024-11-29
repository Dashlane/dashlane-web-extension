import React from "react";
import classnames from "classnames";
import { Maybe } from "tsmonad";
import styles from "./styles.css";
function getColorClassName(securityScore: Maybe<number>): string {
  return securityScore.caseOf({
    nothing: () => styles.securityScoreUnknown,
    just: (score) => {
      if (score >= 80) {
        return styles.securityScoreOver80;
      }
      if (score >= 60) {
        return styles.securityScoreOver60;
      }
      if (score >= 40) {
        return styles.securityScoreOver40;
      }
      if (score >= 20) {
        return styles.securityScoreOver20;
      }
      return styles.securityScoreOver0;
    },
  });
}
export interface Props {
  score: Maybe<number>;
  size: "medium" | "small";
  children?: React.ReactNode;
}
const SecurityScoreBadge = ({ score, size, children }: Props) => {
  const sizeClassName = size === "small" ? styles.small : styles.medium;
  return (
    <div
      className={classnames(
        styles.box,
        getColorClassName(score),
        sizeClassName
      )}
    >
      <div className={styles.shield} />
      <div>{children}</div>
    </div>
  );
};
export default SecurityScoreBadge;
