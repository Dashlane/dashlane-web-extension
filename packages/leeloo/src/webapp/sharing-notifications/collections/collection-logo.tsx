import { Flex } from "@dashlane/design-system";
import { FolderIcon } from "@dashlane/ui-components";
interface CollectionLogoProps {
  disabled?: boolean;
}
export const CollectionLogo = ({ disabled = false }: CollectionLogoProps) => (
  <Flex
    justifyContent="space-around"
    alignItems="center"
    sx={{
      minWidth: "48px",
      width: "48px",
      height: "32px",
      borderRadius: 2,
      backgroundColor: "ds.container.agnostic.neutral.standard",
      flexShrink: 0,
      borderColor: "ds.border.neutral.quiet.idle",
      borderStyle: "solid",
      borderWidth: "1px",
    }}
  >
    <FolderIcon disabled={disabled} color={"ds.oddity.focus"} />
  </Flex>
);
