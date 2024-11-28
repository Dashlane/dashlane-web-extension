import React from "react";
import { Credential } from "@dashlane/vault-contracts";
import { jsx } from "@dashlane/design-system";
import { Thumbnail } from "@dashlane/ui-components";
import { ParsedURL } from "@dashlane/url-parser";
import { openCredential } from "../helpers";
import { useDomainIconDetails } from "../../../../libs/hooks/use-domain-icon-details";
import { Header } from "../common/header";
interface Props {
  credential: Credential;
  onClose: () => void;
}
const CredentialDetailHeaderComponent: React.FC<Props> = ({
  credential,
  onClose,
}) => {
  const { backgroundColor, iconSource } = useDomainIconDetails(
    new ParsedURL(credential.URL).getRootDomain()
  );
  return (
    <Header
      Icon={
        <Thumbnail
          text={credential.itemName}
          backgroundColor={backgroundColor}
          size="small"
          iconSource={iconSource}
        />
      }
      title={credential.itemName}
      onEdit={() => {
        void openCredential(credential.URL, credential.id);
      }}
      onClose={onClose}
    />
  );
};
export const CredentialDetailHeader = React.memo(
  CredentialDetailHeaderComponent
);
