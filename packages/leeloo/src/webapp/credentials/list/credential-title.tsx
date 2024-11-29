import { ReactNode } from "react";
import { Credential } from "@dashlane/vault-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { CredentialInfo } from "../../../libs/dashlane-style/credential-info/credential-info";
import { CompromisedInfo } from "./compromised-info/compromised-info";
interface CredentialTitleProps {
  credential: Credential;
  requiresMP: boolean;
  isCompromised: boolean;
  isShared: boolean;
  showTitleIcons?: boolean;
  tag?: ReactNode;
}
export const CredentialTitle = ({
  credential,
  requiresMP,
  isCompromised,
  isShared,
  showTitleIcons,
  tag,
}: CredentialTitleProps) => {
  const { itemName, URL, email, username } = credential;
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <CredentialInfo
        title={itemName}
        showTitleIcons={showTitleIcons}
        login={username}
        email={email}
        shared={isShared}
        autoProtected={requiresMP}
        domain={new ParsedURL(URL).getRootDomain()}
        tag={tag}
        sxProps={{
          maxWidth: "350px",
          minWidth: 0,
          marginRight: "8px",
        }}
      />
      <div
        sx={{
          display: "flex",
          flexGrow: "1",
          justifyContent: "flex-end",
        }}
      >
        <CompromisedInfo compromised={isCompromised} />
      </div>
    </div>
  );
};
