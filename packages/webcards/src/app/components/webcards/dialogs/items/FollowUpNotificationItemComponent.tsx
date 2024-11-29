import * as React from "react";
import { jsx } from "@dashlane/design-system";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { VaultIngredient } from "@dashlane/autofill-engine/types";
import { AutofillEngineCommands } from "@dashlane/autofill-engine/client";
import { getStarsRepresentationForHiddenValues } from "../../../../utils/helpers";
import { InputType } from "../../../../communication/types";
import { CopyButton } from "../../../common/layout/CopyButton";
import styles from "./FollowUpNotificationItemComponent.module.scss";
const SX_STYLES = {
  CONTAINER: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px 5px 16px",
  },
  COPIED_CONTAINER: {
    backgroundColor: "ds.container.expressive.positive.quiet.idle",
  },
  PROPERTY_LABEL: {
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "16px",
    marginBottom: "4px",
  },
  PROPERTY_VALUE: {
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "20px",
  },
  DIVIDER: {
    border: "none",
    borderTop: "1px solid",
    borderTopColor: "ds.border.neutral.quiet.idle",
    padding: "0",
    margin: "0",
  },
};
interface Props<T extends VaultSourceType> {
  itemId: string;
  webcardId: string;
  itemType: T;
  property: VaultIngredient["property"];
  label: string;
  inputType: InputType;
  isPropertyCopied: boolean;
  value?: string;
  isCopyButtonDisabled?: boolean;
  autofillEngineCommands?: AutofillEngineCommands;
  onClickCopyButton: (copiedProperty: VaultIngredient["property"]) => void;
  previouslyCopiedProperties: VaultIngredient["property"][];
}
export const FollowUpNotificationItemComponent = <T extends VaultSourceType>(
  props: Props<T>
) => {
  const {
    itemId,
    webcardId,
    itemType,
    property,
    label,
    value,
    inputType,
    isPropertyCopied,
    isCopyButtonDisabled = false,
    autofillEngineCommands,
    onClickCopyButton,
    previouslyCopiedProperties,
  } = props;
  return (
    <React.Fragment>
      <div
        sx={
          isPropertyCopied
            ? { ...SX_STYLES.CONTAINER, ...SX_STYLES.COPIED_CONTAINER }
            : SX_STYLES.CONTAINER
        }
      >
        <div className={styles.labelContainer}>
          <span
            sx={{
              ...SX_STYLES.PROPERTY_LABEL,
              color: isPropertyCopied
                ? "ds.text.positive.quiet"
                : "ds.text.neutral.quiet",
            }}
          >
            {label}
          </span>
          <span
            sx={{
              ...SX_STYLES.PROPERTY_VALUE,
              color: isPropertyCopied
                ? "ds.text.positive.quiet"
                : "ds.text.neutral.catchy",
            }}
          >
            {!(inputType === InputType.Text)
              ? getStarsRepresentationForHiddenValues(inputType)
              : value}
          </span>
        </div>
        <div className={styles.actionList}>
          <CopyButton
            disabled={isCopyButtonDisabled}
            autofillEngineCommands={autofillEngineCommands}
            property={property}
            itemId={itemId}
            webcardId={webcardId}
            onClickCopyButton={onClickCopyButton}
            itemType={itemType}
            isPropertyCopied={isPropertyCopied}
            previouslyCopiedProperties={previouslyCopiedProperties}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
