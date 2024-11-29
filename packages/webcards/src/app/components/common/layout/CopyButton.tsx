import React, { useContext, useState } from "react";
import { Tooltip } from "@dashlane/ui-components";
import { AutofillEngineCommands } from "@dashlane/autofill-engine/client";
import { Button, Icon, jsx } from "@dashlane/design-system";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { VaultIngredient } from "@dashlane/autofill-engine/types";
import { I18nContext } from "../../../context/i18n";
const I18N_KEYS = {
  copyTooltip: "copyTooltip",
  copiedTooltip: "copiedTooltip",
};
interface CopyButtonProps<T extends VaultSourceType> {
  autofillEngineCommands?: AutofillEngineCommands;
  itemId: string;
  webcardId: string;
  itemType: T;
  property: VaultIngredient["property"];
  isPropertyCopied: boolean;
  disabled?: boolean;
  onClickCopyButton: (property: VaultIngredient["property"]) => void;
  previouslyCopiedProperties: VaultIngredient["property"][];
}
export const CopyButton = <T extends VaultSourceType>(
  props: CopyButtonProps<T>
) => {
  const { translate } = useContext(I18nContext);
  const {
    disabled = false,
    autofillEngineCommands,
    itemId,
    webcardId,
    itemType,
    property,
    isPropertyCopied,
    onClickCopyButton,
    previouslyCopiedProperties,
  } = props;
  const [isCopied, setIsCopied] = useState(isPropertyCopied);
  const handleCopyClick = () => {
    onClickCopyButton(property);
    autofillEngineCommands?.copyToClipboard(
      itemId,
      {
        type: itemType,
        property,
      } as VaultIngredient,
      webcardId,
      previouslyCopiedProperties
    );
    setIsCopied(true);
  };
  return (
    <Tooltip
      content={
        isCopied
          ? translate(I18N_KEYS.copiedTooltip)
          : translate(I18N_KEYS.copyTooltip)
      }
      placement="bottom"
      passThrough={disabled}
    >
      <Button
        aria-label={translate(I18N_KEYS.copyTooltip)}
        type="button"
        mood="brand"
        intensity="supershy"
        size="medium"
        layout="iconOnly"
        icon={
          <Icon
            name={
              isPropertyCopied ? "FeedbackSuccessFilled" : "ActionCopyOutlined"
            }
            color={
              isPropertyCopied
                ? "ds.text.positive.standard"
                : "ds.text.neutral.catchy"
            }
          />
        }
        onClick={handleCopyClick}
        disabled={disabled}
        onMouseLeave={() => setIsCopied(false)}
      />
    </Tooltip>
  );
};
