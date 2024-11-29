import { useState } from "react";
import { Tooltip, TrashIcon } from "@dashlane/ui-components";
import { Domain } from "@dashlane/communication";
import colors from "../../../../../libs/dashlane-style/globals/color-variables.css";
import styles from "./styles.css";
import { DeactivateDomainDialog } from "./deactivate-dialog";
interface DeactivateDomainProps {
  domain: Domain;
  deactivateDomain: () => Promise<unknown>;
  isDisabled?: boolean;
  disabledTooltipText?: string;
}
export const DeactivateDomain = ({
  domain,
  deactivateDomain,
  isDisabled,
  disabledTooltipText,
}: DeactivateDomainProps) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const onDeleteIconClick = () => {
    if (isDisabled) {
      return;
    }
    setShowDeletePopup(true);
  };
  return (
    <>
      {showDeletePopup ? (
        <DeactivateDomainDialog
          domain={domain}
          onConfirm={deactivateDomain}
          onDismiss={() => setShowDeletePopup(false)}
        />
      ) : null}
      <div className={styles.deactivateTrashcan} onClick={onDeleteIconClick}>
        <Tooltip
          passThrough={!isDisabled}
          placement="top"
          content={disabledTooltipText ?? ""}
          sx={{ maxWidth: "180px" }}
        >
          <TrashIcon
            disabled={isDisabled}
            size={25}
            color={colors["--dash-green-00"]}
          />
        </Tooltip>
      </div>
    </>
  );
};
