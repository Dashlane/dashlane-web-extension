import { Button } from "@dashlane/design-system";
interface Props {
  content?: string;
  onClick?: () => void;
}
export const CtaButton = ({ onClick, content }: Props) => {
  return (
    <Button
      mood="brand"
      intensity="quiet"
      onClick={onClick}
      sx={{ maxWidth: "fit-content" }}
    >
      {content}
    </Button>
  );
};
