import { HTMLProps, ReactNode, useEffect, useRef, useState } from "react";
import { IconName } from "@dashlane/design-system";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { MenuItem } from "../../../credentials/quick-actions-menu/menu/menu-item";
import { ActionType, useActiveActionContext } from "../active-action-context";
import { Card } from "./card";
interface Props extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  text: string;
  iconName: IconName;
  actionType: ActionType;
}
export const MenuItemWithActionCard = ({
  children,
  text,
  iconName,
  actionType,
  ...cardProps
}: Props) => {
  const { activeAction, toggleActiveAction } = useActiveActionContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cardOrientation, setCardOrientation] = useState("top");
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const determineCardOrientation = () => {
    const cardElement = dropdownRef.current;
    if (!cardElement) {
      return;
    }
    const cardRect = cardElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (cardRect.top < windowHeight / 2) {
      setCardOrientation("top");
    } else {
      setCardOrientation("bottom");
    }
  };
  const handleClickOnMenuItem = () => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else {
      toggleActiveAction(actionType);
    }
  };
  useEffect(() => {
    determineCardOrientation();
  }, []);
  if (shouldShowFrozenStateDialog === null) {
    return null;
  }
  return (
    <div ref={dropdownRef}>
      <MenuItem
        onClick={handleClickOnMenuItem}
        icon={iconName}
        text={text}
        hasArrowIcon
      />
      {activeAction === actionType && (
        <div
          sx={{
            position: "relative",
          }}
        >
          <Card cardOrientation={cardOrientation} {...cardProps}>
            {children}
          </Card>
        </div>
      )}
    </div>
  );
};
