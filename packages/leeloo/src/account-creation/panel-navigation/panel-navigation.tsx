import type { Location } from "history";
import { Button, Flex, Paragraph } from "@dashlane/design-system";
import { useHistory } from "../../libs/router";
export type LocationState = Location<{
  ignoreRedirect?: boolean;
}>;
export interface Props {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  redirectLocation: LocationState | string;
  helperText: string;
  buttonText: string;
}
export const PanelNavigation = ({
  onClick,
  redirectLocation,
  helperText,
  buttonText,
}: Props) => {
  const history = useHistory();
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    history.push(redirectLocation);
  };
  return (
    <Flex
      justifyContent="flex-end"
      alignItems="center"
      gap="10px"
      role="navigation"
      sx={{
        position: "sticky",
        top: "40px",
        paddingRight: "40px",
        height: "40px",
      }}
    >
      <Paragraph color="ds.text.neutral.quiet">{helperText}</Paragraph>
      <Button mood="neutral" intensity="quiet" onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </Flex>
  );
};
