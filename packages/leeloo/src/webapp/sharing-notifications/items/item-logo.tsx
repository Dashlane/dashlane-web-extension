import { memo, useMemo } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { ShareableItemType } from "@dashlane/sharing-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { useAreRichIconsEnabled } from "../../../libs/hooks/use-are-rich-icons-enabled";
import { getNoteMatchingColor } from "../../search/results/helpers/get-note-matching-color";
interface ItemLogoProps {
  itemType: ShareableItemType;
  url?: string;
  color?: string;
}
export const ItemLogoComponent = ({ itemType, url, color }: ItemLogoProps) => {
  const domain = useMemo(() => new ParsedURL(url).getRootDomain(), [url]);
  const areRichIconsEnabled = useAreRichIconsEnabled();
  if (itemType === ShareableItemType.Credential) {
    return (
      <ConnectedDomainThumbnail
        domainURL={domain}
        forceFallback={!areRichIconsEnabled}
      />
    );
  } else if (itemType === ShareableItemType.SecureNote) {
    return (
      <VaultItemThumbnail
        type="secure-note"
        color={getNoteMatchingColor(color)}
      />
    );
  } else {
    return <VaultItemThumbnail type="secret" />;
  }
};
export const ItemLogo = memo(ItemLogoComponent);
