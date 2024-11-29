import { Paragraph } from "@dashlane/design-system";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { useAreRichIconsEnabled } from "../../../libs/hooks/use-are-rich-icons-enabled";
export interface OpenWebsiteProps {
  translation: string;
  domain: string;
  hostname: string;
}
export const OpenWebsiteStep = ({
  translation,
  domain,
  hostname,
}: OpenWebsiteProps) => {
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const [beforeLogo, , afterLogo] = translation.split("_");
  return (
    <Paragraph
      textStyle="ds.body.standard.regular"
      color="ds.text.neutral.standard"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {beforeLogo}
      <span
        sx={{
          display: "inline-block",
          verticalAlign: "center",
          marginLeft: "6px",
          marginRight: "4px",
        }}
      >
        <ConnectedDomainThumbnail
          domainURL={domain}
          size="small"
          forceFallback={!areRichIconsEnabled}
        />
      </span>

      <span
        sx={{
          fontWeight: "600",
        }}
      >
        {hostname}
      </span>
      {afterLogo}
    </Paragraph>
  );
};
