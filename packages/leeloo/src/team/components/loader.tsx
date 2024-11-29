import { Flex } from "@dashlane/design-system";
import LoadingSpinner from "../../libs/dashlane-style/loading-spinner";
export const Loader = ({ scopedToPage = false }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "rgba(245, 247, 247, 0.7)",
        ...(scopedToPage
          ? {}
          : {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
            }),
      }}
    >
      <LoadingSpinner
        containerStyle={{
          marginTop: "-90px",
          ...(scopedToPage ? { position: "relative", height: "90vh" } : {}),
        }}
      />
    </Flex>
  );
};
