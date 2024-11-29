import { Flex, Logo } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { accountManagementApi } from "@dashlane/account-contracts";
import {
  ChangeLoginError,
  ChangeLoginLoading,
  ChangeLoginSuccess,
} from "./components";
export const ChangeLoginEmailContainer = () => {
  const changeLoginEmailStatus = useModuleQuery(
    accountManagementApi,
    "changeLoginEmailStatus"
  );
  const getComponent = () => {
    if (
      changeLoginEmailStatus.status !== DataStatus.Success ||
      changeLoginEmailStatus.data.status === "no_request"
    ) {
      return null;
    }
    switch (changeLoginEmailStatus.data.status) {
      case "success":
        return <ChangeLoginSuccess />;
      case "failed":
        return <ChangeLoginError error={changeLoginEmailStatus.data.error} />;
      case "in_progress":
      default:
        return <ChangeLoginLoading />;
    }
  };
  return (
    <Flex
      alignContent="center"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      sx={{ height: "100vh", width: "100vw" }}
    >
      <Logo
        height={40}
        name="DashlaneLockup"
        sx={{ position: "absolute", top: "40px", left: "40px" }}
      />
      {getComponent()}
    </Flex>
  );
};
