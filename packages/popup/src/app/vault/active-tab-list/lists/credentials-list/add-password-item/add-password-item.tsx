import * as React from "react";
import {
  ExpressiveIcon,
  jsx,
  ListItem,
  Paragraph,
} from "@dashlane/design-system";
import { ConnectedDomainThumbnail } from "@dashlane/framework-react";
import { ParsedURL } from "@dashlane/url-parser";
import { windowsGetCurrent } from "@dashlane/webextensions-apis";
import { useShowPasswordLimit } from "../../../../../../libs/hooks/use-show-password-limit";
import { useAreRichIconsEnabled } from "../../../../../../libs/hooks/use-are-rich-icons-enabled";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
import { openWebAppAndClosePopup } from "../../../../../helpers";
const I18N_KEYS = {
  CTA: "tab/all_items/empty_cta",
  SUGGESTEDITEMS_SUBTITLE:
    "tab/all_items/suggested_item_section/add_password/subtitle",
  SUGGESTEDITEMS_TITLE:
    "tab/all_items/suggested_item_section/add_password/title",
};
interface Props {
  name?: string;
  website?: string;
  origin: string;
}
export const AddPasswordItem = ({ name, website = "", origin }: Props) => {
  const { translate } = useTranslate();
  const areRichIconsEnabled = useAreRichIconsEnabled();
  const passwordLimit = useShowPasswordLimit();
  const openAddNewCredential = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const webappQuery = {
      name: name ? name : "",
      website,
    };
    void openWebAppAndClosePopup({
      id: "new",
      query: webappQuery,
      route: "/passwords",
    });
  };
  const [favIconUrlSpec, setFavIconUrlSpec] = React.useState("");
  React.useEffect(() => {
    const setIcon = async () => {
      const activeWindow = await windowsGetCurrent({ populate: true });
      const activeTab = activeWindow.tabs?.find((tab) => tab.active);
      setFavIconUrlSpec(activeTab?.favIconUrl ?? "");
    };
    void setIcon();
  }, []);
  if (
    passwordLimit === null ||
    passwordLimit.shouldDisplayPasswordLimitBanner
  ) {
    return null;
  }
  return (
    <ListItem aria-label="add-password-button" onClick={openAddNewCredential}>
      <div
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {favIconUrlSpec ? (
          <ConnectedDomainThumbnail
            domainURL={new ParsedURL(favIconUrlSpec).getRootDomain()}
            forceFallback={!areRichIconsEnabled}
          />
        ) : (
          <ExpressiveIcon name="ActionAddOutlined" />
        )}
        <div
          sx={{
            marginLeft: "12px",
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          {origin === "list" && <div>{translate(I18N_KEYS.CTA)}</div>}
          {origin === "suggested" && (
            <>
              <Paragraph color="ds.text.neutral.standard">
                {translate(I18N_KEYS.SUGGESTEDITEMS_TITLE)}
              </Paragraph>
              <Paragraph
                textStyle="ds.body.reduced.regular"
                color="ds.text.neutral.quiet"
              >
                {translate(I18N_KEYS.SUGGESTEDITEMS_SUBTITLE)}
              </Paragraph>
            </>
          )}
        </div>
      </div>
    </ListItem>
  );
};
