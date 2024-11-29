import { useRef } from "react";
import { Button } from "@dashlane/design-system";
interface ProfileAdminFooterProps {
  handleBack: () => void;
  handleForward: () => void;
  backIcon?: string;
  forwardIcon?: string;
  backButtonText: string;
  forwardButtonText: string;
}
export const ProfileAdminFooter = ({
  handleBack,
  handleForward,
  backIcon,
  forwardIcon,
  backButtonText,
  forwardButtonText,
}: ProfileAdminFooterProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const handleBackButtonClick = () => {
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
    handleBack();
  };
  return (
    <div
      sx={{
        paddingTop: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Button
        icon={backIcon}
        intensity="supershy"
        layout="iconLeading"
        mood={backIcon ? "brand" : "neutral"}
        ref={buttonRef}
        size="medium"
        type="button"
        onClick={handleBackButtonClick}
      >
        {backButtonText}
      </Button>

      <Button
        icon={forwardIcon}
        intensity="catchy"
        layout="iconTrailing"
        mood="brand"
        size="medium"
        type="button"
        onClick={handleForward}
      >
        {forwardButtonText}
      </Button>
    </div>
  );
};
