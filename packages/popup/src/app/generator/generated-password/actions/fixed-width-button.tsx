import * as React from "react";
import { Button } from "@dashlane/design-system";
import type { CommonSelectorsForTests } from "../../..";
import styles from "./fixed-width-button.css";
interface Props extends CommonSelectorsForTests {
  className?: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  textList: string[];
  textIndex: number;
}
export const FixedWidthButton: React.FC<Props> = ({
  id,
  className,
  disabled,
  onClick,
  textIndex,
  textList,
}) => {
  const maxWidthText = textList.reduce((a, b) =>
    a.length >= b.length ? a : b
  );
  return (
    <Button
      id={id}
      disabled={disabled}
      onClick={onClick}
      className={className}
      size="small"
    >
      <div className={styles.grid}>
        <span className={styles.hiddenText}>{maxWidthText}</span>
        <span className={styles.displayedText}>{textList[textIndex]}</span>
      </div>
    </Button>
  );
};
