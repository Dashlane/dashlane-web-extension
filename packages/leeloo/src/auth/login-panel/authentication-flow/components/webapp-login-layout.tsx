import { Flex } from "@dashlane/design-system";
interface Props {
  children: React.ReactNode;
}
export const WebappLoginLayout = ({ children }: Props) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    sx={{ marginTop: "150px" }}
    role="main"
  >
    <Flex
      justifyContent="left"
      flexDirection="column"
      gap="32px"
      sx={{ width: "350px", position: "relative" }}
    >
      {children}
    </Flex>
  </Flex>
);
