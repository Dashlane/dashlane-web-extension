import { ReactNode, useContext } from "react";
import {
  Card,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { AutofillDropdownWebcardDataBase } from "@dashlane/autofill-engine/types";
import { LayoutUtilsContext } from "../../../context/layoutUtils";
import { useWebcardGeometry } from "../../webcards/effects/useWebcardGeometry";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { ScreenReaderSpeech } from "../generic/ScreenReaderSpeech";
import { SX_STYLES } from "./CardLayout.styles";
export interface CardLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  isDropdown?: boolean;
  webcardData?: AutofillDropdownWebcardDataBase;
  withNoMainPadding?: boolean;
  withNoContentCardWrapper?: boolean;
}
export const CardLayout = ({
  children,
  footer,
  header,
  isDropdown,
  webcardData,
  withNoMainPadding,
  withNoContentCardWrapper,
}: CardLayoutProps) => {
  const { sendWebcardGeometry } = useContext(LayoutUtilsContext);
  const webcardRef = useWebcardGeometry({
    sendWebcardGeometry,
  });
  const cardLayout: Partial<ThemeUIStyleObject> = mergeSx([
    SX_STYLES.CARD_LAYOUT,
    isDropdown ? SX_STYLES.DROPDOWN_LAYOUT : SX_STYLES.DIALOG_LAYOUT,
  ]);
  const activeElementDescription = useKeyboardNavigation({
    container: webcardRef,
    webcardId: webcardData?.webcardId,
    srcElement: webcardData?.srcElement,
  });
  return (
    <div sx={cardLayout} ref={webcardRef}>
      {header ?? null}
      <main
        sx={
          withNoMainPadding
            ? SX_STYLES.MAIN_WITHOUT_PADDING
            : SX_STYLES.MAIN_WITH_PADDING
        }
      >
        {withNoContentCardWrapper ? (
          children
        ) : (
          <Card padding="8px">{children}</Card>
        )}
      </main>
      {footer ?? null}
      {activeElementDescription ? (
        <ScreenReaderSpeech>{activeElementDescription}</ScreenReaderSpeech>
      ) : null}
    </div>
  );
};
