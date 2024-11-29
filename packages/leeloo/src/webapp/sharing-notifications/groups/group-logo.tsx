import { Flex } from "@dashlane/design-system";
import { colors, SharingGroupIcon } from "@dashlane/ui-components";
interface GroupLogoProps {
  disabled?: boolean;
}
export const GroupLogo = ({ disabled = false }: GroupLogoProps) => (
  <Flex
    justifyContent="space-around"
    alignItems="center"
    sx={{
      minWidth: "48px",
      width: "48px",
      height: "32px",
      borderRadius: 2,
      backgroundColor: colors.midGreen02,
      flexShrink: 0,
    }}
  >
    <SharingGroupIcon disabled={disabled} color={colors.white} />
  </Flex>
);
