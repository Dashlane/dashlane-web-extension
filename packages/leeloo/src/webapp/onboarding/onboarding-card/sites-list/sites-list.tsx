import { DataStatus } from "@dashlane/framework-react";
import { Flex } from "@dashlane/design-system";
import { useSpaces } from "../../../../libs/carbon/hooks/useSpaces";
import { SiteIcon } from "./site-icon";
import { b2bSites, b2cSites } from "./sites";
interface SitesListProps {
  onSiteIconClick: (domain: string, loginUrl: string) => void;
}
export const SitesList = ({ onSiteIconClick }: SitesListProps) => {
  const spaces = useSpaces();
  const isB2BUser =
    spaces.status === DataStatus.Success && spaces.data.length > 0;
  const sites = isB2BUser ? b2bSites : b2cSites;
  return (
    <Flex
      flexWrap="wrap"
      sx={{
        padding: "40px 0",
      }}
    >
      {sites.map((siteProps) => {
        return (
          <SiteIcon
            onSiteIconClick={onSiteIconClick}
            key={siteProps.label}
            {...siteProps}
          />
        );
      })}
    </Flex>
  );
};
