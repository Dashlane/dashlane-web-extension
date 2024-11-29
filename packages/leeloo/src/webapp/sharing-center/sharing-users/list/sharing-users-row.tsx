import * as React from "react";
import { Flex } from "@dashlane/design-system";
import { Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { AvatarWithAbbreviatedText } from "../../../../libs/dashlane-style/avatar/avatar-with-abbreviated-text";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import Row, { RowLinkProps } from "../../../list-view/row";
import styles from "./sharing-users-list.css";
const I18N_KEYS = {
  ITEMS_SHARED: "webapp_sharing_center_item_shared",
};
export interface SharingUsersRowProps {
  userLogin: string;
  itemCount: number;
}
export const SharingUsersRow = ({
  userLogin,
  itemCount,
}: SharingUsersRowProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const formatSharingUser = (): RowLinkProps => {
    return {
      link: routes.userSharingUserInfo(userLogin),
      type: "link",
      data: [
        {
          key: "name",
          content: (
            <Flex alignItems="center" gap="18px">
              <AvatarWithAbbreviatedText
                email={userLogin}
                avatarSize={48}
                placeholderFontSize={24}
                placeholderTextType="firstTwoCharacters"
              />
              <Paragraph size="medium" color="ds.text.neutral.standard">
                <strong>{userLogin}</strong>
              </Paragraph>
            </Flex>
          ),
        },
        {
          key: "itemsShared",
          content: translate(I18N_KEYS.ITEMS_SHARED, {
            count: itemCount,
          }),
          className: styles.userRowCellItems,
        },
      ],
    };
  };
  const content = formatSharingUser();
  return <Row {...content} key={userLogin} />;
};
