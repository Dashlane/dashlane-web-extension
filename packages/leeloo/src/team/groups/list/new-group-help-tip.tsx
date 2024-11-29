import { Paragraph } from "@dashlane/design-system";
import { Tooltip } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PropsWithChildren } from "react";
const I18N_KEYS = {
  NEW_GROUP_TOOLTIP: "team_groups_list_new_group_tooltip",
};
type NewGroupHelpTipProps = PropsWithChildren<{
  key: string;
  index: number;
  isFirstTimeGroupCreation: boolean;
  hasNewGroupDelayPassed: boolean;
}>;
export const NewGroupHelpTip = ({
  key,
  index,
  isFirstTimeGroupCreation,
  hasNewGroupDelayPassed,
  children,
}: NewGroupHelpTipProps) => {
  const { translate } = useTranslate();
  return (
    <Tooltip
      sx={{
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        animation: "fadeIn 250ms ease-out",
      }}
      key={key}
      passThrough={
        index !== 0 || !isFirstTimeGroupCreation || !hasNewGroupDelayPassed
      }
      placement="bottom"
      arrowSize={12}
      trigger="persist"
      content={
        <Paragraph color="ds.text.inverse.standard">
          {translate(I18N_KEYS.NEW_GROUP_TOOLTIP)}
        </Paragraph>
      }
    >
      {children}
    </Tooltip>
  );
};
