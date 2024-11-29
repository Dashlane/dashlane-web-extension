import { Button, Infobox } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTeamSpaceContext } from "../../team/settings/components/TeamSpaceContext";
import { useIsPersonalSpaceDisabled } from "../../libs/hooks/use-is-personal-space-disabled";
const SHARE_COLLECTIONS_DASHLANE_LINK = "__REDACTED__";
export const ShareCollectionInfo = () => {
  const { translate } = useTranslate();
  const { teamId } = useTeamSpaceContext();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  if (
    !teamId ||
    (isPersonalSpaceDisabled.status === DataStatus.Success &&
      isPersonalSpaceDisabled.isDisabled)
  ) {
    return null;
  }
  return (
    <Infobox
      actions={[
        <Button
          key="know-more"
          intensity="quiet"
          size="small"
          as="a"
          href={SHARE_COLLECTIONS_DASHLANE_LINK}
        >
          {translate("webapp_sharing_invite_know_more")}
        </Button>,
      ]}
      size="large"
      title={translate("webapp_sharing_invite_collection_tooltip")}
      icon="TipOutlined"
      mood="brand"
      sx={{ margin: "8px 0px" }}
    />
  );
};
